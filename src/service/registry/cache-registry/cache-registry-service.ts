import {ICacheRegistryService} from "./i-cache-registry-service";
import {IFileSaver} from "@wessberg/filesaver";
import {IPolyfillFeature, IPolyfillFeatureInput} from "../../../polyfill/i-polyfill-feature";
import {getPolyfillConfigChecksum, getPolyfillIdentifier, getPolyfillSetIdentifier} from "../../../util/polyfill/polyfill-util";
import {join} from "path";
import {constant} from "../../../constant/constant";
import {IFileLoader} from "@wessberg/fileloader";
import {IMemoryRegistryService, PolyfillCachingContext} from "../polyfill-registry/i-memory-registry-service";
import {PolyfillName} from "../../../polyfill/polyfill-name";
import {coerce, gt} from "semver";
import {IConfig} from "../../../config/i-config";
import {IRegistryGetResult} from "../polyfill-registry/i-registry-get-result";
import {ILoggerService} from "../../logger/i-logger-service";
import {PolyfillDictEntry} from "../../../polyfill/polyfill-dict";

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
	async get(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillCachingContext): Promise<IRegistryGetResult | undefined> {
		// Attempt to fetch it from the in-memory registry
		const memoryHit = await this.memoryRegistry.get(name, context);
		if (memoryHit != null) return memoryHit;

		// Otherwise, attempt to get it from cache
		const buffer = await this.getFromCache(this.getCachePath(name, context));
		// If not possible, return undefined
		if (buffer == null) return undefined;

		// Otherwise, store it in the memory registry and return the Buffer
		return await this.memoryRegistry.set(name, buffer, context);
	}

	/**
	 * Gets the Set of Polyfill feature inputs that matches the given input
	 */
	async getPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, context: PolyfillCachingContext): Promise<Set<IPolyfillFeature> | undefined> {
		// Attempt to fetch it from the in-memory registry
		const memoryHit = await this.memoryRegistry.getPolyfillFeatureSet(input, context);
		if (memoryHit != null) return memoryHit;

		// Otherwise, attempt to get it from cache
		const buffer = await this.getFromCache(this.getCachePathForPolyfillSet(input, context));
		// If not possible, return undefined
		if (buffer == null) return undefined;

		// Otherwise, store it in the memory registry and return the Buffer
		return await this.memoryRegistry.setPolyfillFeatureSet(input, new Set(JSON.parse(buffer.toString())), context);
	}

	/**
	 * Returns true if a polyfill wil the given name exists
	 */
	async has(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillCachingContext): Promise<boolean> {
		return (await this.get(name, context)) != null;
	}

	/**
	 * Returns true if there is a PolyfillFeature Set in the cache that matches the given input Set
	 */
	async hasPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, context: PolyfillCachingContext): Promise<boolean> {
		return (await this.getPolyfillFeatureSet(input, context)) != null;
	}

	/**
	 * Sets the contents for the polyfill with the given name and of the given encoding
	 */
	async set(name: IPolyfillFeature | Set<IPolyfillFeature>, contents: Buffer, context: PolyfillCachingContext): Promise<IRegistryGetResult> {
		// Add it to the memory cache as well as the disk cache
		await this.writeToCache(this.getCachePath(name, context), contents);
		return await this.memoryRegistry.set(name, contents, context);
	}

	/**
	 * Sets the given PolyfillFeature Set for the given Set of PolyfillFeature inputs
	 */
	async setPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, polyfillSet: Set<IPolyfillFeature>, context: PolyfillCachingContext): Promise<Set<IPolyfillFeature>> {
		// Add it to the memory cache as well as the disk cache
		await this.writeToCache(this.getCachePathForPolyfillSet(input, context), Buffer.from(JSON.stringify([...polyfillSet])));
		return await this.memoryRegistry.setPolyfillFeatureSet(input, polyfillSet, context);
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
		const lastCachedConfigChecksum = await this.getLastCachedPolyfillConfigChecksum();
		if (lastCachedConfigChecksum !== getPolyfillConfigChecksum()) return true;

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

	private async getLastCachedPolyfillConfigChecksum(): Promise<string | undefined> {
		const buffer = await this.getFromCache(constant.path.configChecksum);
		return buffer != null ? buffer.toString("utf8") : undefined;
	}

	async updateCachedPolyfillConfigChecksumPackageVersionMap(): Promise<void> {
		await this.fileSaver.save(constant.path.configChecksum, getPolyfillConfigChecksum());
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
	private getCachePath(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillCachingContext): string {
		return join(constant.path.cacheRoot, getPolyfillIdentifier(name, context));
	}

	/**
	 * Gets the cache path to the given Polyfill Feature Set
	 */
	private getCachePathForPolyfillSet(input: Set<IPolyfillFeatureInput>, context: PolyfillCachingContext): string {
		return join(constant.path.cacheRoot, getPolyfillSetIdentifier(input, context));
	}
}
