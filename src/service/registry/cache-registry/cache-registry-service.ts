import {ICacheRegistryService} from "./i-cache-registry-service";
import {IFileSaver} from "@wessberg/filesaver";
import {IPolyfillFeature} from "../../../polyfill/i-polyfill-feature";
import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {getPolyfillIdentifier} from "../../../util/polyfill/polyfill-util";
import {join} from "path";
import {constant} from "../../../constant/constant";
import {IFileLoader} from "@wessberg/fileloader";
import {IMemoryRegistryService} from "../polyfill-registry/i-memory-registry-service";
import {PolyfillName} from "../../../polyfill/polyfill-name";
import {gt, coerce} from "semver";
import {ICacheRegistryServiceUpdatePackageVersionMapOptions} from "./i-cache-registry-service-update-package-version-map-options";
import {IConfig} from "../../../config/i-config";
import {IRegistryGetResult} from "../polyfill-registry/i-registry-get-result";

/**
 * A class that can cache generated Polyfills on disk
 */
export class CacheRegistryService implements ICacheRegistryService {

	constructor (private readonly fileSaver: IFileSaver,
							 private readonly fileLoader: IFileLoader,
							 private readonly memoryRegistry: IMemoryRegistryService,
							 private readonly config: IConfig) {
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
	 * Returns true if a polyfill wil the given name exists
	 * @param {IPolyfillFeature|Set<IPolyfillFeature>} name
	 * @param {ContentEncodingKind} [encoding]
	 * @returns {Promise<boolean>}
	 */
	public async has (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<boolean> {
		return (await this.get(name, encoding)) != null;
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
	 * @param {ICacheRegistryServiceUpdatePackageVersionMapOptions[]} options
	 * @returns {Promise<void>}
	 */
	public async updatePackageVersionMap (...options: ICacheRegistryServiceUpdatePackageVersionMapOptions[]): Promise<void> {
		const packageVersionMap = await this.getPackageVersionMap();
		options.forEach(option => packageVersionMap[option.polyfillName] = option.version);
		await this.fileSaver.save(constant.path.cachePackageVersionMap, JSON.stringify(packageVersionMap, null, " "));
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
		// Never return anything from the cache if 'clearCache' is true
		if (this.config.clearCache) return undefined;

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
}