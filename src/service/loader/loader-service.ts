import {ILoaderService} from "./i-loader-service";
import {ILoaderServiceOptions} from "./i-loader-service-options";
import {ILoaderServiceResult} from "./i-loader-service-result";
import {join} from "path";
import {IFileLoader} from "@wessberg/fileloader";

/**
 * A class that can load the contents of a NPM systemjs relative to the executable path of polyfiller
 * provided a given entry path
 */
export class LoaderService implements ILoaderService {
	/**
	 * A cache of previously resolved results
	 * @type {Map<string, ILoaderServiceResult>}
	 */
	private readonly cache: Map<string, ILoaderServiceResult> = new Map();

	constructor (private readonly fileLoader: IFileLoader) {
	}

	/**
	 * Generates a bundle for an app
	 * @param {ILoaderServiceOptions} options
	 * @returns {Promise<ILoaderServiceResult>}
	 */
	public async load (options: ILoaderServiceOptions): Promise<ILoaderServiceResult> {
		// Check if it exists within the cache and return it if so
		const cacheEntry = this.getCacheEntry(options);
		if (cacheEntry != null) return cacheEntry;

		// Unpack the options
		const {module, entry} = options;

		// Get the location to the modules' requested entry file
		const nodeModulesDirectory = join(__dirname, "../node_modules");
		const packageDirectory = join(nodeModulesDirectory, module);
		try {
			const content = (await this.fileLoader.load(join(packageDirectory, entry))).toString();
			const newCacheEntry: ILoaderServiceResult = {
				packageDirectory,
				content
			};
			// Store it within the cache
			this.setCacheEntry(options, newCacheEntry);

			// Return it
			return newCacheEntry;
		} catch (ex) {
			throw new ReferenceError(`Internal Error: Module: '${module}' could not be found. Reason: ${ex.toString()}!`);
		}
	}

	/**
	 * Gets the identifier to use within the cache
	 * @param {ILoaderServiceOptions} options
	 * @returns {string}
	 */
	private getCacheEntryIdentifier ({module, entry}: ILoaderServiceOptions): string {
		return `${module}.${entry}`;
	}

	/**
	 * Returns an entry from the cache, if any exists
	 * @param {ILoaderServiceOptions} options
	 * @returns {ILoaderServiceResult | undefined}
	 */
	private getCacheEntry (options: ILoaderServiceOptions): ILoaderServiceResult|undefined {
		return this.cache.get(this.getCacheEntryIdentifier(options));
	}

	/**
	 * Returns an entry from the cache, if any exists
	 * @param {ILoaderServiceOptions} options
	 * @param {ILoaderServiceResult} result
	 * @returns {ILoaderServiceResult | undefined}
	 */
	private setCacheEntry (options: ILoaderServiceOptions, result: ILoaderServiceResult): void {
		this.cache.set(this.getCacheEntryIdentifier(options), result);
	}
}