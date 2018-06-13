import {ICacheRegistryService} from "./i-cache-registry-service";
import {IFileSaver} from "@wessberg/filesaver";
import {IPolyfillFeature, IPolyfillFeatureInput} from "../../../polyfill/i-polyfill-feature";
import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {getCoreJsBundleIdentifier, getPolyfillIdentifier, getPolyfillSetIdentifier} from "../../../util/polyfill/polyfill-util";
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

/**
 * A class that can cache generated Polyfills on disk
 */
export class CacheRegistryService implements ICacheRegistryService {

	constructor (private readonly fileSaver: IFileSaver,
							 private readonly logger: ILoggerService,
							 private readonly fileLoader: IFileLoader,
							 private readonly memoryRegistry: IMemoryRegistryService,
							 private readonly config: IConfig) {
	}

	/**
	 * Initializes the Cache registry
	 */
	public async initialize (): Promise<void> {
		// Flush the entire cache if requested
		if (this.config.clearCache) {
			await this.flushCache();
		}
		// Otherwise, update the disk cache
		await this.updateDiskCache();
	}

	/**
	 * Gets the contents for the polyfill with the given name and with the given encoding
	 * @param {IPolyfillFeature|Set<IPolyfillFeature>} name
	 * @param {ContentEncodingKind} [encoding]
	 * @returns {Promise<IRegistryGetResult?>}
	 */
	public async get (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<IRegistryGetResult|undefined> {
		// Attempt to fetch it from the in-memory registry
		const memoryHit = await this.memoryRegistry.get(name, encoding);
		if (memoryHit != null) return memoryHit;

		// Otherwise, attempt to get it from cache
		const buffer = await this.getFromCache(
			this.getCachePath(name, encoding)
		);
		// If not possible, return undefined
		if (buffer == null) return undefined;

		// Otherwise, store it in the memory registry and return the Buffer
		return await this.memoryRegistry.set(name, buffer, encoding);
	}

	/**
	 * Gets the Set of Polyfill feature inputs that matches the given input
	 * @param {Set<IPolyfillFeatureInput>} input
	 * @param {string} userAgent
	 */
	public async getPolyfillFeatureSet (input: Set<IPolyfillFeatureInput>, userAgent: string): Promise<Set<IPolyfillFeature>|undefined> {
		// Attempt to fetch it from the in-memory registry
		const memoryHit = await this.memoryRegistry.getPolyfillFeatureSet(input, userAgent);
		if (memoryHit != null) return memoryHit;

		// Otherwise, attempt to get it from cache
		const buffer = await this.getFromCache(
			this.getCachePathForPolyfillSet(input, userAgent)
		);
		// If not possible, return undefined
		if (buffer == null) return undefined;

		// Otherwise, store it in the memory registry and return the Buffer
		return await this.memoryRegistry.setPolyfillFeatureSet(input, new Set(JSON.parse(buffer.toString())), userAgent);
	}

	/**
	 * Gets the Core-js bundle that matches the given paths
	 * @param {string[]} paths
	 * @returns {Promise<Buffer|undefined>}
	 */
	public async getCoreJsBundle (paths: string[]): Promise<Buffer|undefined> {
		// Attempt to fetch it from the in-memory registry
		const memoryHit = await this.memoryRegistry.getCoreJsBundle(paths);
		if (memoryHit != null) return memoryHit;

		// Otherwise, attempt to get it from cache
		const buffer = await this.getFromCache(
			this.getCachePathForCoreJsBundle(paths)
		);
		// If not possible, return undefined
		if (buffer == null) return undefined;

		// Otherwise, store it in the memory registry and return the Buffer
		return await this.memoryRegistry.setCoreJsBundle(paths, buffer);
	}

	/**
	 * Returns true if a polyfill wil the given name exists
	 * @param {IPolyfillFeature|Set<IPolyfillFeature>} name
	 * @param {ContentEncodingKind} [encoding]
	 * @returns {Promise<boolean>}
	 */
	public async has (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<boolean> {
		return (await this.get(name, encoding)) != null;
	}

	/**
	 * Returns true if there is a PolyfillFeature Set in the cache that matches the given input Set
	 * @param {Set<IPolyfillFeatureInput>} input
	 * @param {string} userAgent
	 */
	public async hasPolyfillFeatureSet (input: Set<IPolyfillFeatureInput>, userAgent: string): Promise<boolean> {
		return (await this.getPolyfillFeatureSet(input, userAgent)) != null;
	}

	/**
	 * Returns true if there is a Core-js bundle in cache that matches the given paths
	 * @param {string[]} paths
	 * @returns {Promise<boolean>}
	 */
	public async hasCoreJsBundle (paths: string[]): Promise<boolean> {
		return (await this.getCoreJsBundle(paths)) != null;
	}

	/**
	 * Sets the contents for the polyfill with the given name and of the given encoding
	 * @param {IPolyfillFeature|Set<IPolyfillFeature>} name
	 * @param {Buffer} contents
	 * @param {ContentEncodingKind} [encoding]
	 * @returns {Promise<IRegistryGetResult>}
	 */
	public async set (name: IPolyfillFeature|Set<IPolyfillFeature>, contents: Buffer, encoding?: ContentEncodingKind): Promise<IRegistryGetResult> {
		// Add it to the memory cache as well as the disk cache
		await this.writeToCache(
			this.getCachePath(name, encoding),
			contents
		);
		return await this.memoryRegistry.set(name, contents, encoding);
	}

	/**
	 * Sets the given PolyfillFeature Set for the given Set of PolyfillFeature inputs
	 * @param {Set<IPolyfillFeatureInput>} input
	 * @param {Set<IPolyfillFeature>} polyfillSet
	 * @param {string} userAgent
	 * @returns {Promise<Set<IPolyfillFeature>>}
	 */
	public async setPolyfillFeatureSet (input: Set<IPolyfillFeatureInput>, polyfillSet: Set<IPolyfillFeature>, userAgent: string): Promise<Set<IPolyfillFeature>> {
		// Add it to the memory cache as well as the disk cache
		await this.writeToCache(
			this.getCachePathForPolyfillSet(input, userAgent),
			Buffer.from(JSON.stringify([...polyfillSet]))
		);
		return await this.memoryRegistry.setPolyfillFeatureSet(input, polyfillSet, userAgent);
	}

	/**
	 * Sets the Core-js bundle that matches the given paths in the cache
	 * @param {string[]} paths
	 * @param {Buffer} bundle
	 */
	public async setCoreJsBundle (paths: string[], bundle: Buffer): Promise<Buffer> {
		// Add it to the memory cache as well as the disk cache
		await this.writeToCache(
			this.getCachePathForCoreJsBundle(paths),
			bundle
		);
		return await this.memoryRegistry.setCoreJsBundle(paths, bundle);
	}

	/**
	 * Returns true if the given polyfill name needs an update within the cache
	 * @param {PolyfillName} polyfillName
	 * @param {string} currentVersion
	 * @returns {Promise<boolean>}
	 */
	public async needsUpdate (polyfillName: PolyfillName, currentVersion: string): Promise<boolean> {
		const packageVersionMap = await this.getPackageVersionMap();
		const cachedVersion = packageVersionMap[polyfillName];
		return cachedVersion == null || gt(coerce(currentVersion)!.version, coerce(cachedVersion)!.version);
	}

	/**
	 * Updates the cached package version map
	 * @param {IterableIterator<PolyfillName, string>} options
	 * @returns {Promise<void>}
	 */
	public async updatePackageVersionMap (options: IterableIterator<[PolyfillName, string]>): Promise<void> {
		const packageVersionMap = await this.getPackageVersionMap();
		for (const [name, version] of options) {
			packageVersionMap[name] = version;
		}

		await this.fileSaver.save(constant.path.cachePackageVersionMap, JSON.stringify(packageVersionMap, null, " "));
	}

	/**
	 * Updates the disk cache. If the cache is already valid, there is nothing to do.
	 * Otherwise, it will store all polyfilled libraries and their current versions
	 * @returns {Promise<void>}
	 */
	private async updateDiskCache (): Promise<void> {
		// Start with validating the disk cache
		const cacheIsValid = await this.validateDiskCache();
		// If the cache is valid, do no more
		if (cacheIsValid) return;

		// Otherwise, build a map of libraries and their versions
		const libraryToVersionMap: Map<PolyfillName, string> = new Map();
		await Promise.all(Object.entries(constant.polyfill).map(async ([polyfillName, polyfill]: [PolyfillName, PolyfillDictEntry]) => {
			// Skip aliases
			if ("polyfills" in polyfill) return;

			// Map the version to the library name
			if (!libraryToVersionMap.has(polyfillName)) {
				libraryToVersionMap.set(polyfillName, polyfill.version);
			}
		}));

		// Update the disk cache
		await this.updatePackageVersionMap(libraryToVersionMap.entries());
	}

	/**
	 * Validates the disk cache. If any version of any package has been updated,
	 * the entire cache will be flushed.
	 * If 'true' is returned, the cache is valid
	 * @returns {Promise<boolean>}
	 */
	private async validateDiskCache (): Promise<boolean> {

		for (const [polyfillName, polyfill] of Object.entries(constant.polyfill)) {
			// Skip aliases
			if ("polyfills" in polyfill) continue;

			// If the local copy of the polyfill needs to be updated, flush the entire cache
			if (await this.needsUpdate(<PolyfillName> polyfillName, polyfill.version)) {
				this.logger.debug(`${polyfillName} needs an update! Flushing cache...`);
				await this.flushCache();
				return false;
			}
		}
		return true;
	}

	/**
	 * Flushes the cache entirely
	 * @returns {Promise<void>>}
	 */
	private async flushCache (): Promise<void> {
		await this.fileSaver.remove(constant.path.cacheRoot);
	}

	/**
	 * Writes the given Buffer to cache
	 * @param {string} path
	 * @param {Buffer} content
	 * @returns {Promise<void>}
	 */
	private async writeToCache (path: string, content: Buffer): Promise<void> {
		await this.fileSaver.save(path, content);
	}

	/**
	 * Gets the package version map from the cache. A new one will be created if it doesn't exist already
	 * @returns {object}
	 */
	private async getPackageVersionMap (): Promise<{ [key: string]: string }> {
		let packageVersionMap: { [key: string]: string };
		const packageVersionMapRaw = await this.getFromCache(constant.path.cachePackageVersionMap);
		packageVersionMap = packageVersionMapRaw == null ? {} : JSON.parse(packageVersionMapRaw.toString());
		return packageVersionMap;
	}

	/**
	 * Returns the contents on the given path from the cache
	 * @param {string} path
	 * @returns {Promise<void>}
	 */
	private async getFromCache (path: string): Promise<Buffer|undefined> {

		try {
			return await this.fileLoader.load(path);
		} catch {
			return undefined;
		}
	}

	/**
	 * Gets the cache path to the given name and encoding
	 * @param {IPolyfillFeature | Set<IPolyfillFeature>} name
	 * @param {ContentEncodingKind} encoding
	 * @returns {string}
	 */
	private getCachePath (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): string {
		return join(constant.path.cacheRoot, getPolyfillIdentifier(name, encoding));
	}

	/**
	 * Gets the cache path to the given Polyfill Feature Set
	 * @param {Set<IPolyfillFeatureInput>} input
	 * @param {string} userAgent
	 * @returns {string}
	 */
	private getCachePathForPolyfillSet (input: Set<IPolyfillFeatureInput>, userAgent: string): string {
		return join(constant.path.cacheRoot, getPolyfillSetIdentifier(input, userAgent));
	}

	/**
	 * Gets the cache path to the bundle generated for the given Core-js paths
	 * @param {string[]} paths
	 * @returns {string}
	 */
	private getCachePathForCoreJsBundle (paths: string[]): string {
		return join(constant.path.cacheRoot, getCoreJsBundleIdentifier(paths));
	}
}