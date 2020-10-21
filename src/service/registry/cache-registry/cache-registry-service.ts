import {ICacheRegistryService} from "./i-cache-registry-service";
import {IFileSaver} from "@wessberg/filesaver";
import {IPolyfillFeature, IPolyfillFeatureInput} from "../../../polyfill/i-polyfill-feature";
import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {getPolyfillIdentifier, getPolyfillSetIdentifier} from "../../../util/polyfill/polyfill-util";
import {join} from "path";
import {constant} from "../../../constant/constant";
import {IFileLoader} from "@wessberg/fileloader";
import {IMemoryRegistryService} from "../polyfill-registry/i-memory-registry-service";
import {PolyfillName} from "../../../polyfill/polyfill-name";
import {coerce, gt} from "semver";
import {IConfig} from "../../../config/i-config";
import {IRegistryGetResult} from "../polyfill-registry/i-registry-get-result";
import {ILoggerService} from "../../logger/i-logger-service";
import {PolyfillDictEntry} from "../../../polyfill/polyfill-dict";
import {PolyfillContext} from "../../../polyfill/polyfill-context";

/**
 * A class that can cache generated Polyfills on disk
 */
export class CacheRegistryService implements ICacheRegistryService {
	constructor(
		private readonly fileSaver: IFileSaver,
		private readonly logger: ILoggerService,
		private readonly fileLoader: IFileLoader,
		private readonly memoryRegistry: IMemoryRegistryService,
		private readonly config: IConfig
	) {}

	/**
	 * Initializes the Cache registry
	 */
	async initialize(): Promise<void> {
		// Flush the entire cache if requested
		if (this.config.clearCache) {
			await this.flushCache();
		}
		// Otherwise, update the disk cache
		await this.updateDiskCache();
	}

	/**
	 * Gets the contents for the polyfill with the given name and with the given encoding
	 */
	async get(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillContext, encoding?: ContentEncodingKind): Promise<IRegistryGetResult | undefined> {
		// Attempt to fetch it from the in-memory registry
		const memoryHit = await this.memoryRegistry.get(name, context, encoding);
		if (memoryHit != null) return memoryHit;

		// Otherwise, attempt to get it from cache
		const buffer = await this.getFromCache(this.getCachePath(name, context, encoding));
		// If not possible, return undefined
		if (buffer == null) return undefined;

		// Otherwise, store it in the memory registry and return the Buffer
		return await this.memoryRegistry.set(name, buffer, context, encoding);
	}

	/**
	 * Gets the Set of Polyfill feature inputs that matches the given input
	 */
	async getPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, userAgent: string, context: PolyfillContext): Promise<Set<IPolyfillFeature> | undefined> {
		// Attempt to fetch it from the in-memory registry
		const memoryHit = await this.memoryRegistry.getPolyfillFeatureSet(input, userAgent, context);
		if (memoryHit != null) return memoryHit;

		// Otherwise, attempt to get it from cache
		const buffer = await this.getFromCache(this.getCachePathForPolyfillSet(input, userAgent, context));
		// If not possible, return undefined
		if (buffer == null) return undefined;

		// Otherwise, store it in the memory registry and return the Buffer
		return await this.memoryRegistry.setPolyfillFeatureSet(input, new Set(JSON.parse(buffer.toString())), userAgent, context);
	}

	/**
	 * Returns true if a polyfill wil the given name exists
	 */
	async has(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillContext, encoding?: ContentEncodingKind): Promise<boolean> {
		return (await this.get(name, context, encoding)) != null;
	}

	/**
	 * Returns true if there is a PolyfillFeature Set in the cache that matches the given input Set
	 */
	async hasPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, userAgent: string, context: PolyfillContext): Promise<boolean> {
		return (await this.getPolyfillFeatureSet(input, userAgent, context)) != null;
	}

	/**
	 * Sets the contents for the polyfill with the given name and of the given encoding
	 */
	async set(name: IPolyfillFeature | Set<IPolyfillFeature>, contents: Buffer, context: PolyfillContext, encoding?: ContentEncodingKind): Promise<IRegistryGetResult> {
		// Add it to the memory cache as well as the disk cache
		await this.writeToCache(this.getCachePath(name, context, encoding), contents);
		return await this.memoryRegistry.set(name, contents, context, encoding);
	}

	/**
	 * Sets the given PolyfillFeature Set for the given Set of PolyfillFeature inputs
	 */
	async setPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, polyfillSet: Set<IPolyfillFeature>, userAgent: string, context: PolyfillContext): Promise<Set<IPolyfillFeature>> {
		// Add it to the memory cache as well as the disk cache
		await this.writeToCache(this.getCachePathForPolyfillSet(input, userAgent, context), Buffer.from(JSON.stringify([...polyfillSet])));
		return await this.memoryRegistry.setPolyfillFeatureSet(input, polyfillSet, userAgent, context);
	}

	/**
	 * Returns true if the given polyfill name needs an update within the cache
	 */
	async needsUpdate(polyfillName: PolyfillName, currentVersion: string): Promise<boolean> {
		const packageVersionMap = await this.getPackageVersionMap();
		const cachedVersion = packageVersionMap[polyfillName];

		return cachedVersion == null || isNaN(parseInt(cachedVersion)) || gt(coerce(currentVersion)!.version, coerce(cachedVersion)!.version);
	}

	/**
	 * Updates the cached package version map
	 */
	async updatePackageVersionMap(options: IterableIterator<[PolyfillName, string]>): Promise<void> {
		const packageVersionMap = await this.getPackageVersionMap();
		for (const [name, version] of options) {
			packageVersionMap[name] = version;
		}

		await this.fileSaver.save(constant.path.cachePackageVersionMap, JSON.stringify(packageVersionMap, null, " "));
	}

	/**
	 * Updates the disk cache. If the cache is already valid, there is nothing to do.
	 * Otherwise, it will store all polyfilled libraries and their current versions
	 */
	private async updateDiskCache(): Promise<void> {
		// Start with validating the disk cache
		const cacheIsValid = await this.validateDiskCache();
		// If the cache is valid, do no more
		if (cacheIsValid) return;

		// Otherwise, build a map of libraries and their versions
		const libraryToVersionMap: Map<PolyfillName, string> = new Map();
		const entries = Object.entries(constant.polyfill) as [PolyfillName, PolyfillDictEntry][];
		await Promise.all(
			entries.map(async ([polyfillName, polyfill]) => {
				// Skip aliases
				if ("polyfills" in polyfill) return;

				// Map the version to the library name
				if (!libraryToVersionMap.has(polyfillName)) {
					libraryToVersionMap.set(polyfillName, polyfill.version);
				}
			})
		);

		// Update the disk cache
		await this.updatePackageVersionMap(libraryToVersionMap.entries());
	}

	/**
	 * Validates the disk cache. If any version of any package has been updated,
	 * the entire cache will be flushed.
	 * If 'true' is returned, the cache is valid
	 */
	private async validateDiskCache(): Promise<boolean> {
		for (const [polyfillName, polyfill] of Object.entries(constant.polyfill)) {
			// Skip aliases
			if ("polyfills" in polyfill) continue;

			// If the local copy of the polyfill needs to be updated, flush the entire cache
			if (await this.needsUpdate(polyfillName as PolyfillName, polyfill.version)) {
				this.logger.debug(`${polyfillName} needs an update! Flushing cache...`);
				await this.flushCache();
				return false;
			}
		}
		return true;
	}

	/**
	 * Flushes the cache entirely
	 */
	private async flushCache(): Promise<void> {
		try {
			await this.fileSaver.remove(constant.path.cacheRoot);
		} catch {
			// The environment does not allow writing to the cache root
		}
	}

	/**
	 * Writes the given Buffer to cache
	 */
	private async writeToCache(path: string, content: Buffer): Promise<void> {
		try {
			await this.fileSaver.save(path, content);
		} catch {
			// The environment does not allow writing to the cache root
		}
	}

	/**
	 * Gets the package version map from the cache. A new one will be created if it doesn't exist already
	 *
	 * @returns
	 */
	private async getPackageVersionMap(): Promise<{[key: string]: string}> {
		const packageVersionMapRaw = await this.getFromCache(constant.path.cachePackageVersionMap);
		return packageVersionMapRaw == null ? {} : JSON.parse(packageVersionMapRaw.toString());
	}

	/**
	 * Returns the contents on the given path from the cache
	 *
	 * @param path
	 * @returns
	 */
	private async getFromCache(path: string): Promise<Buffer | undefined> {
		try {
			return await this.fileLoader.load(path);
		} catch {
			return undefined;
		}
	}

	/**
	 * Gets the cache path to the given name and encoding
	 */
	private getCachePath(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillContext, encoding?: ContentEncodingKind): string {
		return join(constant.path.cacheRoot, getPolyfillIdentifier(name, context, encoding));
	}

	/**
	 * Gets the cache path to the given Polyfill Feature Set
	 */
	private getCachePathForPolyfillSet(input: Set<IPolyfillFeatureInput>, userAgent: string, context: PolyfillContext): string {
		return join(constant.path.cacheRoot, getPolyfillSetIdentifier(input, userAgent, context));
	}
}
