import {IPolyfillBuilderService} from "./i-polyfill-builder-service";
import {ILoggerService} from "../logger/i-logger-service";
// @ts-ignore
import builder from "core-js-builder";
import {PolyfillName} from "../../polyfill/polyfill-name";
import {constant} from "../../constant/constant";
import {ILoaderService} from "../loader/i-loader-service";
import {IPolyfillBuildDictEntry, IPolyfillCustomDictEntry, IPolyfillLibraryDictEntry, PolyfillDictEntry} from "../../polyfill/polyfill-dict";
import {Buffer} from "buffer";
import {IMinifyService} from "../minify/i-minify-service";
import {IPolyfillFeature} from "../../polyfill/i-polyfill-feature";
import {IFileLoader} from "@wessberg/fileloader";
import {join, parse} from "path";
import {ICacheRegistryService} from "../registry/cache-registry/i-cache-registry-service";
import {ILoaderServiceResult} from "../loader/i-loader-service-result";
import {OnBuiltPolyfillsCallback} from "./on-built-polyfills-callback";

/**
 * A service that can load and cache all polyfills
 */
export class PolyfillBuilderService implements IPolyfillBuilderService {
	/**
	 * Whether or not polyfills are currently being built
	 * @type {boolean}
	 */
	public building: boolean = false;

	/**
	 * Whether or not polyfills has been built some time in the past
	 * @type {boolean}
	 */
	public hasBuilt: boolean = false;

	/**
	 * All callbacks that will be invoked when polyfills has been built
	 * @type {Set<OnBuiltPolyfillsCallback>}
	 */
	private readonly onBuiltPolyfillsCallbacks: Set<OnBuiltPolyfillsCallback> = new Set();

	constructor (private readonly logger: ILoggerService,
							 private readonly loader: ILoaderService,
							 private readonly minifier: IMinifyService,
							 private readonly registry: ICacheRegistryService,
							 private readonly fileLoader: IFileLoader) {
	}

	/**
	 * Retrieves the options to use with core-js
	 * @returns {object}
	 */
	private get coreJsOptions () {
		return {
			umd: false,
			library: false
		};
	}

	/**
	 * Builds all polyfills and retrieves a Map between Polyfill names and their content
	 * @returns {Promise<void>}
	 */
	public async build (): Promise<void> {
		if (this.building || this.hasBuilt) return;
		this.building = true;
		this.hasBuilt = false;

		this.logger.log(`Building polyfills...`);

		// Prepare a map of package versions to update within the cache
		const packageVersionMapUpdates: Map<PolyfillName, string> = new Map();

		await Promise.all(
			Object.entries(constant.polyfill)
				.map(async ([name, dict]: [PolyfillName, PolyfillDictEntry]) => {
					await this.addPolyfill(name, dict, packageVersionMapUpdates);
				}));

		// If at least one package has been updated and stored within the cache, update the package version map
		if (packageVersionMapUpdates.size > 0) {
			await this.registry.updatePackageVersionMap(
				...Array.from(packageVersionMapUpdates.entries()).map(([polyfillName, version]) => ({polyfillName, version}))
			);
		}

		this.logger.log(`Finished building polyfills! 🎉`);
		this.building = false;
		this.hasBuilt = true;
		this.onBuiltPolyfillsCallbacks.forEach(callback => callback());
		this.onBuiltPolyfillsCallbacks.clear();
	}

	/**
	 * Adds a callback to the Set of callbacks to invoke when polyfills has been successfully built
	 * @returns {Promise<void>}
	 */
	public async onBuilt (): Promise<void> {
		return new Promise<void>(resolve => {
			if (!this.building && this.hasBuilt) return resolve();
			else this.onBuiltPolyfillsCallbacks.add(resolve);
		});
	}

	/**
	 * Handles the metadata related to the Intl polyfill
	 * @param {IPolyfillBuildDictEntry} dict
	 * @param {string} packageDirectory
	 * @param {Map<PolyfillName, string>} packageVersionMapUpdates
	 * @returns {Promise<void>}
	 */
	private async handleIntlPolyfillMetadata (dict: IPolyfillLibraryDictEntry, packageDirectory: string, packageVersionMapUpdates: Map<PolyfillName, string>): Promise<void> {
		if (dict.meta == null) return;
		if (!("localeDir" in dict.meta)) return;

		// Get all locale files within the Intl directory
		const files = await this.fileLoader.getAllInDirectory(join(packageDirectory, dict.meta.localeDir));

		for (const file of files) {
			// The name will be equal to that of the filename
			const {name} = parse(file);

			const localePolyfill = <IPolyfillFeature> {
				name,
				meta: {}
			};

			// Do nothing if the locale has already been added
			if (await this.hasPolyfill(localePolyfill, dict.version)) continue;

			this.logger.log(`Adding missing locale: ${name} to registry...`);

			// Otherwise, add it
			await this.compressAndAddPolyfill(localePolyfill, await this.fileLoader.load(file), dict.version, packageVersionMapUpdates);
		}
	}

	/**
	 * Handles any polyfill related to a polyfill that should be added
	 * @param {IPolyfillFeature} polyfill
	 * @param {PolyfillDictEntry} dict
	 * @param {string} packageJson
	 * @param {Map<PolyfillName, string>} packageVersionMapUpdates
	 * @returns {Promise<void>}
	 */
	private async handlePolyfillMetadata (polyfill: IPolyfillFeature, dict: PolyfillDictEntry, packageJson: string, packageVersionMapUpdates: Map<PolyfillName, string>): Promise<void> {
		switch (polyfill.name) {
			case "intl":
				return await this.handleIntlPolyfillMetadata(<IPolyfillLibraryDictEntry> dict, packageJson, packageVersionMapUpdates);
		}
	}

	/**
	 * Returns true if the given polyfill has already been cached
	 * @param {IPolyfillFeature} feature
	 * @param {string} currentVersion
	 * @returns {Promise<boolean>}
	 */
	private async hasPolyfill (feature: IPolyfillFeature, currentVersion: string): Promise<boolean> {
		return (
			!(await this.registry.needsUpdate(feature.name, currentVersion)) &&
			await this.registry.has(feature)
		);
	}

	/**
	 * Compresses the given polyfill and adds it to the registry
	 * @param {IPolyfillFeature} polyfill
	 * @param {Buffer} content
	 * @param {string} version
	 * @param {Map<PolyfillName, string>} packageVersionMapUpdates
	 * @returns {Promise<void>}
	 */
	private async compressAndAddPolyfill (polyfill: IPolyfillFeature, content: Buffer, version: string, packageVersionMapUpdates: Map<PolyfillName, string>): Promise<void> {
		// Make sure that all polyfills end with a newline
		const contentWithNewline = `${content}\n`;

		// Minify it
		const minified = Buffer.from(this.minifier.minify({code: contentWithNewline}));

		// Add the polyfills to the registry
		await this.registry.set(polyfill, minified);

		// Mark the polyfill and its' current version to be updated in the package version map
		packageVersionMapUpdates.set(polyfill.name, version);
	}

	/**
	 * Adds a custom polyfill
	 * @param {IPolyfillFeature} polyfill
	 * @param {IPolyfillCustomDictEntry} dict
	 * @param {Map<PolyfillName, string>} packageVersionMapUpdates
	 * @returns {Promise<void>}
	 */
	private async addCustomPolyfill (polyfill: IPolyfillFeature, dict: IPolyfillCustomDictEntry, packageVersionMapUpdates: Map<PolyfillName, string>): Promise<void> {
		// Check if the polyfill is already registered and do nothing if it is
		if (await this.hasPolyfill(polyfill, dict.version)) return;

		this.logger.log(`Adding ${polyfill.name} to cache registry...`);

		// Use the content already available within the dict
		const content = Buffer.from(dict.content);
		// Compress it
		await this.compressAndAddPolyfill(polyfill, content, dict.version, packageVersionMapUpdates);
	}

	/**
	 * Adds a core-js polyfill
	 * @param {IPolyfillFeature} polyfill
	 * @param {IPolyfillBuildDictEntry} dict
	 * @param {Map<PolyfillName, string>} packageVersionMapUpdates
	 * @returns {Promise<void>}
	 */
	private async addCoreJsPolyfill (polyfill: IPolyfillFeature, dict: IPolyfillBuildDictEntry, packageVersionMapUpdates: Map<PolyfillName, string>): Promise<void> {
		// Check if the polyfill is already registered and do nothing if it is
		if (await this.hasPolyfill(polyfill, dict.version)) return;

		this.logger.log(`Adding ${polyfill.name} to cache registry...`);

		// Build a bundle with core-js
		const content = await builder({...this.coreJsOptions, modules: dict.coreJsModules});
		// Compress it
		await this.compressAndAddPolyfill(polyfill, content, dict.version, packageVersionMapUpdates);
	}

	/**
	 * Adds a standard polyfill to the registry
	 * @param {IPolyfillFeature} polyfill
	 * @param {IPolyfillLibraryDictEntry} dict
	 * @param {Map<PolyfillName, string>} packageVersionMapUpdates
	 * @returns {Promise<void>}
	 */
	private async addStandardPolyfill (polyfill: IPolyfillFeature, dict: IPolyfillLibraryDictEntry, packageVersionMapUpdates: Map<PolyfillName, string>): Promise<void> {
		const loaderResults: ILoaderServiceResult[] = await Promise.all(dict.relativePaths.map(async entry => await this.loader.load({module: dict.library, entry})));
		// Merge all content of the loaderResults
		const loaderResultsContent = loaderResults.map(result => result.content).join("\n");

		// Also take the given extra content if given, otherwise just use the loader results
		const content = dict.extraContent != null ? `${loaderResultsContent}\n${dict.extraContent}` : loaderResultsContent;

		// Take the package directory of the first result. They will always be identical
		const packageDirectory = loaderResults[0].packageDirectory;

		// Check if the polyfill is already registered and do nothing if it is
		if (!(await this.hasPolyfill(polyfill, dict.version))) {
			this.logger.log(`Adding ${polyfill.name} to cache registry...`);

			// Compress it
			await this.compressAndAddPolyfill(polyfill, Buffer.from(content), dict.version, packageVersionMapUpdates);
		}

		// Handle metadata
		await this.handlePolyfillMetadata(polyfill, dict, packageDirectory, packageVersionMapUpdates);

	}

	/**
	 * Adds the given polyfill
	 * @param {PolyfillName} name
	 * @param {PolyfillDictEntry} dict
	 * @param {Map<PolyfillName, string>} packageVersionMapUpdates
	 * @returns {Promise<void>}
	 */
	private async addPolyfill (name: PolyfillName, dict: PolyfillDictEntry, packageVersionMapUpdates: Map<PolyfillName, string>): Promise<void> {

		// Format the polyfill
		const formattedPolyfill: IPolyfillFeature = {name, meta: {}};

		if ("coreJsModules" in dict) {
			return await this.addCoreJsPolyfill(formattedPolyfill, dict, packageVersionMapUpdates);
		}

		else if ("content" in dict) {
			return await this.addCustomPolyfill(formattedPolyfill, dict, packageVersionMapUpdates);
		}

		else {
			return await this.addStandardPolyfill(formattedPolyfill, dict, packageVersionMapUpdates);
		}

	}

}