import {IPolyfillBuilderService} from "./i-polyfill-builder-service";
import {constant} from "../../constant/constant";
import {Buffer} from "buffer";
import {IMinifyService} from "../minify/i-minify-service";
import {IPolyfillFeature} from "../../polyfill/i-polyfill-feature";
import {IFileLoader} from "@wessberg/fileloader";
import {join} from "path";
import {ICompressorService} from "../compression/i-compressor-service";
import {ICompressedPolyfillSetResult} from "./i-compressed-polyfill-set-result";
// @ts-ignore
import builder from "core-js-builder";
import {IPolyfillLibraryDictEntry} from "../../polyfill/polyfill-dict";
import {ICacheRegistryService} from "../registry/cache-registry/i-cache-registry-service";
import {ILoggerService} from "../logger/i-logger-service";

/**
 * A service that can load and cache all polyfills
 */
export class PolyfillBuilderService implements IPolyfillBuilderService {

	constructor (private readonly minifier: IMinifyService,
							 private readonly logger: ILoggerService,
							 private readonly cacheService: ICacheRegistryService,
							 private readonly compressor: ICompressorService,
							 private readonly fileLoader: IFileLoader) {
	}

	/**
	 * Builds the given PolyfillSet and returns the result in all encodings
	 * @param {Set<IPolyfillFeature>} polyfillSet
	 * @returns {Promise<ICompressedPolyfillSetResult>}
	 */
	public async buildPolyfillSet (polyfillSet: Set<IPolyfillFeature>): Promise<ICompressedPolyfillSetResult> {
		const input: string[] = [];
		let content: string = "";
		let hasAddedCoreJsContent: boolean = false;

		// Take all Core Js paths
		const coreJsPaths = [].concat.apply([], [...polyfillSet].map(polyfillFeature => {
			if (!this.isCoreJs(polyfillFeature)) return [];

			const match = <IPolyfillLibraryDictEntry> constant.polyfill[polyfillFeature.name];
			return match.relativePaths.map(relativePath => relativePath
				.replace("modules/", "")
				.replace(".js", ""));
		}));

		// Check if a bundle has been built previously for the given core js paths
		let coreJsContent = await this.cacheService.getCoreJsBundle(coreJsPaths);

		// If not, build a bundle and store within the cache
		if (coreJsContent == null) {
			// Build a bundle of the CoreJs paths
			coreJsContent = Buffer.from(coreJsPaths.length < 1 ? "" : await builder({modules: coreJsPaths}));
			// Store it within the cache
			await this.cacheService.setCoreJsBundle(coreJsPaths, coreJsContent);
		}

		else {
			this.logger.debug(`Matched CoreJS paths in cache!`);
		}

		for (const polyfillFeature of polyfillSet) {
			// If this polyfill feature represents Core Js, add its' content to the bundle unless it has been added previously
			if (this.isCoreJs(polyfillFeature)) {
				if (!hasAddedCoreJsContent) {
					hasAddedCoreJsContent = true;
					content += `\n${coreJsContent.toString()}`;
				}
				continue;
			}

			const absolutePaths: string[] = [];
			const match = constant.polyfill[polyfillFeature.name];
			if (match == null || "polyfills" in match) {
				throw new TypeError(`No aliased polyfill names can be built! These must be resolved before calling ${this.buildPolyfillSet.name}!`);
			}

			if ("library" in match) {
				const {library, relativePaths, meta} = match;
				// Resolve the node modules directory
				const nodeModulesDirectory = join(__dirname, "../node_modules");
				// Resolve the directory of the package.json file
				const packageDirectory = join(nodeModulesDirectory, library);

				// For each of the relative paths, compute the absolute path
				absolutePaths.push(...relativePaths.map(path => join(packageDirectory, path)));

				// If the Polyfill is "intl" and a localeDir is associated with it, also resolve the requested locales (if any)
				if (polyfillFeature.name === "intl" && meta != null && "localeDir" in meta && polyfillFeature.meta.locale != null) {
					// Normalize the requested locales to make sure we have an array to work with
					const requestedLocales: string[] = typeof polyfillFeature.meta.locale === "string" ? [polyfillFeature.meta.locale] : polyfillFeature.meta.locale;

					// Loop through all of the requested locales in parallel
					await Promise.all(requestedLocales.map(async requestedLocale => {
						// Resolve the absolute path
						const localePath = join(packageDirectory, meta.localeDir, `${requestedLocale}.js`);
						// If it exists, add it to the array of absolute paths
						if (await this.fileLoader.exists(localePath)) {
							absolutePaths.push(localePath);
						}
					}));
				}
			}

			else if ("localPaths" in match) {
				const {localPaths} = match;
				const rootDirectory = join(__dirname, "../");
				for (const localPath of localPaths) {
					const absoluteLocalPath = join(rootDirectory, localPath);
					absolutePaths.push(absoluteLocalPath);
				}
			}

			// Push all of the absolute paths for this specific polyfill to the input paths
			input.push(...absolutePaths);
		}

		// Load all of the input paths and add them to the generated content
		for (const path of input) {
			content += `\n${(await this.fileLoader.load(path)).toString()}`;
		}

		// Minify the result
		const minified = Buffer.from(await this.minifier.minify({code: Buffer.from(content)}));
		// Compress the result
		const {brotli, zlib} = await this.compressor.compress(minified);

		// Return all of the Buffers
		return {
			brotli, minified, zlib
		};
	}

	/**
	 * Returns true if the given polyfill feature is core-js
	 * @param {IPolyfillFeature} polyfillFeature
	 * @returns {boolean}
	 */
	private isCoreJs (polyfillFeature: IPolyfillFeature): boolean {
		const match = constant.polyfill[polyfillFeature.name];
		return "library" in match && match.library === "core-js";
	}

}