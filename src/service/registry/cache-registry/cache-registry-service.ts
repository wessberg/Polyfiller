import {ICacheRegistryService} from "./i-cache-registry-service";
import {PolyfillFeature, PolyfillFeatureInput} from "../../../polyfill/polyfill-feature";
import {getPolyfillConfigChecksum, getPolyfillIdentifier, getPolyfillSetIdentifier} from "../../../util/polyfill/polyfill-util";
import {join} from "path";
import {constant} from "../../../constant/constant";
import {IMemoryRegistryService, PolyfillCachingContext} from "../polyfill-registry/i-memory-registry-service";
import {PolyfillName} from "../../../polyfill/polyfill-name";
import {coerce, gt} from "semver";
import {IRegistryGetResult} from "../polyfill-registry/i-registry-get-result";
import {ILoggerService} from "../../logger/i-logger-service";
import {PolyfillDictEntry, PolyfillDictNormalizedEntry} from "../../../polyfill/polyfill-dict";
import pkg from "../../../../package.json";
import {Config} from "../../../config/config";
import {IMetricsService} from "../../metrics/i-metrics-service";
import {FileSystem} from "../../../common/lib/file-system/file-system";

/**
 * A class that can cache generated Polyfills on disk
 */
export class CacheRegistryService implements ICacheRegistryService {
	constructor(
		private readonly fileSystem: FileSystem,
		private readonly logger: ILoggerService,
		private readonly memoryRegistry: IMemoryRegistryService,
		private readonly metricsService: IMetricsService,
		private readonly config: Config
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
	async get(name: PolyfillFeature | Set<PolyfillFeature>, context: PolyfillCachingContext): Promise<IRegistryGetResult | undefined> {
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
	async getPolyfillFeatureSet(input: Set<PolyfillFeatureInput>, context: PolyfillCachingContext): Promise<Set<PolyfillFeature> | undefined> {
		// Attempt to fetch it from the in-memory registry
		const memoryHit = await this.memoryRegistry.getPolyfillFeatureSet(input, context);
		if (memoryHit != null) return memoryHit;

		// Otherwise, attempt to get it from cache
		const cachePath = this.getCachePathForPolyfillSet(input, context);
		const buffer = await this.getFromCache(cachePath);

		// If not possible, return undefined
		if (buffer == null) return undefined;

		// Otherwise, store it in the memory registry and return the Buffer
		try {
			const polyfillFeatures = JSON.parse(buffer.toString());
			return await this.memoryRegistry.setPolyfillFeatureSet(input, new Set(polyfillFeatures), context);
		} catch (ex) {
			// It wasn't possible to parse that buffer. The disk cache is in an invalid state, and should be cleaned up
			await this.deleteFromCache(cachePath);
			this.metricsService.captureMessage(`Wiped bad cache entry at path: ${cachePath}`);
			return undefined;
		}
	}

	/**
	 * Returns true if a polyfill wil the given name exists
	 */
	async has(name: PolyfillFeature | Set<PolyfillFeature>, context: PolyfillCachingContext): Promise<boolean> {
		return (await this.get(name, context)) != null;
	}

	/**
	 * Returns true if there is a PolyfillFeature Set in the cache that matches the given input Set
	 */
	async hasPolyfillFeatureSet(input: Set<PolyfillFeatureInput>, context: PolyfillCachingContext): Promise<boolean> {
		return (await this.getPolyfillFeatureSet(input, context)) != null;
	}

	/**
	 * Sets the contents for the polyfill with the given name and of the given encoding
	 */
	async set(name: PolyfillFeature | Set<PolyfillFeature>, contents: Buffer, context: PolyfillCachingContext): Promise<IRegistryGetResult> {
		// Add it to the memory cache as well as the disk cache
		await this.writeToCache(this.getCachePath(name, context), contents);
		return await this.memoryRegistry.set(name, contents, context);
	}

	/**
	 * Sets the given PolyfillFeature Set for the given Set of PolyfillFeature inputs
	 */
	async setPolyfillFeatureSet(input: Set<PolyfillFeatureInput>, polyfillSet: Set<PolyfillFeature>, context: PolyfillCachingContext): Promise<Set<PolyfillFeature>> {
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

		await this.fileSystem.writeFile(constant.path.cachePackageVersionMap, JSON.stringify(packageVersionMap, null, " "));
	}

	private pickVersionForPolyfillEntry(entry: PolyfillDictNormalizedEntry): string {
		if ("library" in entry) {
			if (typeof entry.library === "string") {
				return pkg.dependencies[entry.library];
			}

			let combinedVersionSet = new Set<string>();

			for (const key of ["window", "worker", "node"] as const) {
				if (entry.library[key] == null) continue;
				combinedVersionSet.add(pkg.dependencies[entry.library[key]]);
				return [...combinedVersionSet].join(":");
			}
			throw new ReferenceError(`It wasn't possible to detect a version for the library: ${entry.library}`);
		} else {
			return entry.version;
		}
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
					libraryToVersionMap.set(polyfillName, this.pickVersionForPolyfillEntry(polyfill));
				}
			})
		);

		// Update the disk cache
		await this.updatePackageVersionMap(libraryToVersionMap.entries());
		await this.updateCachedPolyfillConfigChecksumPackageVersionMap();
	}

	/**
	 * Validates the disk cache. If any version of any package has been updated,
	 * the entire cache will be flushed.
	 * If 'true' is returned, the cache is valid
	 */
	private async validateDiskCache(): Promise<boolean> {
		const lastCachedConfigChecksum = await this.getLastCachedPolyfillConfigChecksum();

		// If the config changed, the disk cache needs to be flushed
		if (lastCachedConfigChecksum !== getPolyfillConfigChecksum()) return false;

		for (const [polyfillName, polyfill] of Object.entries(constant.polyfill)) {
			// Skip aliases
			if ("polyfills" in polyfill) continue;

			// If the local copy of the polyfill needs to be updated, flush the entire cache
			if (await this.needsUpdate(polyfillName as PolyfillName, this.pickVersionForPolyfillEntry(polyfill))) {
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
		return this.fileSystem.unlink(constant.path.cacheRoot);
	}

	/**
	 * Writes the given Buffer to cache
	 */
	private async writeToCache(path: string, content: Buffer): Promise<void> {
		return this.fileSystem.writeFile(path, content);
	}

	/**
	 * Gets the package version map from the cache. A new one will be created if it doesn't exist already
	 *
	 * @returns
	 */
	private async getPackageVersionMap(): Promise<{[key: string]: string}> {
		const packageVersionMapRaw = await this.getFromCache(constant.path.cachePackageVersionMap);
		try {
			return packageVersionMapRaw == null ? {} : JSON.parse(packageVersionMapRaw.toString());
		} catch (ex) {
			// If it couldn't be decoded, fall back to an empty cache map, but also flush that entry from the cache
			await this.deleteFromCache(constant.path.cachePackageVersionMap);
			this.metricsService.captureMessage(`Wiped bad package version map from the cache at path: ${constant.path.cachePackageVersionMap}`);
			return {};
		}
	}

	private async getLastCachedPolyfillConfigChecksum(): Promise<string | undefined> {
		const buffer = await this.getFromCache(constant.path.configChecksum);
		return buffer != null ? buffer.toString("utf8") : undefined;
	}

	private async updateCachedPolyfillConfigChecksumPackageVersionMap(): Promise<void> {
		await this.fileSystem.writeFile(constant.path.configChecksum, getPolyfillConfigChecksum());
	}

	/**
	 * Returns the contents on the given path from the cache
	 */
	private async getFromCache(path: string): Promise<Buffer | undefined> {
		return this.fileSystem.readFile(path);
	}

	/**
	 * Deletes the contents on the given path from the cache
	 */
	private async deleteFromCache(path: string): Promise<void> {
		return this.fileSystem.unlink(path);
	}

	/**
	 * Gets the cache path to the given name and encoding
	 */
	private getCachePath(name: PolyfillFeature | Set<PolyfillFeature>, context: PolyfillCachingContext): string {
		return join(constant.path.cacheRoot, getPolyfillIdentifier(name, context));
	}

	/**
	 * Gets the cache path to the given Polyfill Feature Set
	 */
	private getCachePathForPolyfillSet(input: Set<PolyfillFeatureInput>, context: PolyfillCachingContext): string {
		return join(constant.path.cacheRoot, getPolyfillSetIdentifier(input, context));
	}
}
