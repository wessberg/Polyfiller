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
import {ensureArray} from "../../util/ensure-array/ensure-array";
import {IFlattenerService} from "../flattener/i-flattener-service";
import {PolyfillDealiasedName} from "../../polyfill/polyfill-name";
import {sync} from "find-up";

const SYNC_OPTIONS = {cwd: __dirname};

/**
 * A service that can load and cache all polyfills
 */
export class PolyfillBuilderService implements IPolyfillBuilderService {
	constructor(
		private readonly minifier: IMinifyService,
		private readonly flattener: IFlattenerService,
		private readonly logger: ILoggerService,
		private readonly cacheService: ICacheRegistryService,
		private readonly compressor: ICompressorService,
		private readonly fileLoader: IFileLoader
	) {}

	/**
	 * Builds the given PolyfillSet and returns the result in all encodings
	 * @param {Set<IPolyfillFeature>} polyfillSet
	 * @returns {Promise<ICompressedPolyfillSetResult>}
	 */
	public async buildPolyfillSet(polyfillSet: Set<IPolyfillFeature>): Promise<ICompressedPolyfillSetResult> {
		const input: {polyfillName: PolyfillDealiasedName; paths: string[]; flatten: boolean}[] = [];
		let content: string = "";
		let hasAddedCoreJsContent: boolean = false;

		// Take all Core Js paths
		const coreJsPaths = ([] as string[]).concat.apply(
			[],
			[...polyfillSet].map(polyfillFeature => {
				if (!this.isCoreJs(polyfillFeature)) return [];

				const match = <IPolyfillLibraryDictEntry>constant.polyfill[polyfillFeature.name];
				const relativePaths = Array.isArray(match.relativePaths) ? match.relativePaths : match.relativePaths[polyfillFeature.context];
				return relativePaths.map(relativePath => relativePath.replace("modules/", "").replace(".js", ""));
			})
		);

		// Check if a bundle has been built previously for the given core js paths
		let coreJsContent = await this.cacheService.getCoreJsBundle(coreJsPaths);

		// If not, build a bundle and store within the cache
		if (coreJsContent == null) {
			// Build a bundle of the CoreJs paths
			coreJsContent = Buffer.from(coreJsPaths.length < 1 ? "" : await builder({modules: coreJsPaths}));
			// Store it within the cache
			await this.cacheService.setCoreJsBundle(coreJsPaths, coreJsContent);
		} else {
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

			const flatten = match.flatten === true;

			const rootDirectory = "library" in match ? join("node_modules", typeof match.library === "string" ? match.library : match.library[polyfillFeature.context]) : "";

			const localPaths =
				"library" in match
					? Array.isArray(match.relativePaths)
						? match.relativePaths
						: match.relativePaths[polyfillFeature.context]
					: Array.isArray(match.localPaths)
					? match.localPaths
					: match.localPaths[polyfillFeature.context];

			const {meta} = match;

			// If SystemJS is requested, the variant to use may be provided as metadata. If so, we should use that one, rather than the relativePaths
			if (
				polyfillFeature.name === "systemjs" &&
				meta != null &&
				polyfillFeature.meta != null &&
				"variant" in polyfillFeature.meta &&
				(polyfillFeature.meta.variant === "s" || polyfillFeature.meta.variant === "system")
			) {
				for (const variant of ensureArray(meta[polyfillFeature.meta.variant])) {
					const metaVariantPathInput = join(rootDirectory, variant);
					const resolvedMetaVariantPath = sync(metaVariantPathInput, SYNC_OPTIONS);
					if (resolvedMetaVariantPath != null) {
						absolutePaths.push(resolvedMetaVariantPath);
					} else {
						this.logger.debug(`Unresolved path:`, metaVariantPathInput);
					}
				}
			}

			// If shadow-dom is requested, the variant to use may be provided as metadata. If so, we should use that one, rather than the relativePaths
			else if (polyfillFeature.name === "shadow-dom" && meta != null && polyfillFeature.meta != null && "experimental" in polyfillFeature.meta && polyfillFeature.meta.experimental === true) {
				for (const variant of ensureArray(meta.experimental)) {
					const metaVariantPathInput = join(rootDirectory, variant);
					const resolvedMetaVariantPath = sync(metaVariantPathInput, SYNC_OPTIONS);
					if (resolvedMetaVariantPath != null) {
						absolutePaths.push(resolvedMetaVariantPath);
					} else {
						this.logger.debug(`Unresolved path:`, metaVariantPathInput);
					}
				}
			}

			// Otherwise, use all of the given relativePaths
			else {
				// For each of the relative paths, compute the absolute path
				for (const path of localPaths) {
					const pathInput = join(rootDirectory, path);
					const resolvedPath = sync(pathInput, SYNC_OPTIONS);
					if (resolvedPath != null) {
						absolutePaths.push(resolvedPath);
					} else {
						this.logger.debug(`Unresolved path:`, pathInput);
					}
				}
			}

			if (meta != null && polyfillFeature.name === "zone") {
				// If Zone is requested, 'zone-error' may be requested which improves the produced Stack trace when using Zone
				if (polyfillFeature.meta != null && polyfillFeature.meta.error === true) {
					for (const errorPath of ensureArray(meta.error)) {
						const errorPathInput = join(rootDirectory, errorPath);
						const resolvedErrorPath = sync(errorPathInput, SYNC_OPTIONS);
						if (resolvedErrorPath != null) {
							absolutePaths.push(resolvedErrorPath);
						} else {
							this.logger.debug(`Unresolved path:`, errorPathInput);
						}
					}
				}

				// Check if any web component polyfill has been requested
				const hasWCPolyfill = [...polyfillSet].some(({name}) => name === "custom-elements" || name === "shadow-dom");

				// If any web component polyfill has been requested, or if the 'shadydom' zone extension has been explicitly requested
				// add it to the Zone.js polyfill buffer
				if (hasWCPolyfill || (polyfillFeature.meta != null && polyfillFeature.meta.shadydom === true)) {
					for (const shadydomPath of ensureArray(meta.shadydom)) {
						const shadyDomExtensionPathInput = join(rootDirectory, shadydomPath);
						const resolvedShadyDomExtensionPath = sync(shadyDomExtensionPathInput, SYNC_OPTIONS);
						if (resolvedShadyDomExtensionPath != null) {
							absolutePaths.push(resolvedShadyDomExtensionPath);
						} else {
							this.logger.debug(`Unresolved path:`, shadyDomExtensionPathInput);
						}
					}
				}

				// If the Zone-patching of 'matchMedia' is requested, add it to the polyfill buffer for Zone.js
				if (polyfillFeature.meta != null && polyfillFeature.meta.mediaquery === true) {
					for (const mediaqueryPath of ensureArray(meta.mediaquery)) {
						const mediaQueryExtensionPathInput = join(rootDirectory, mediaqueryPath);
						const resolvedMediaQueryExtensionPath = sync(mediaQueryExtensionPathInput, SYNC_OPTIONS);
						if (resolvedMediaQueryExtensionPath != null) {
							absolutePaths.push(resolvedMediaQueryExtensionPath);
						} else {
							this.logger.debug(`Unresolved path:`, mediaQueryExtensionPathInput);
						}
					}
				}

				// If the Zone-patching of 'rxjs' is requested, add it to the polyfill buffer for Zone.js
				if (polyfillFeature.meta != null && polyfillFeature.meta.rxjs === true) {
					for (const rxjsPath of ensureArray(meta.rxjs)) {
						const rxjsExtensionPathInput = join(rootDirectory, rxjsPath);
						const resolvedRxjsExtensionPath = sync(rxjsExtensionPathInput, SYNC_OPTIONS);
						if (resolvedRxjsExtensionPath != null) {
							absolutePaths.push(resolvedRxjsExtensionPath);
						} else {
							this.logger.debug(`Unresolved path:`, rxjsExtensionPathInput);
						}
					}
				}

				// Check if any fetch polyfill has been requested
				const hasFetchPolyfill = [...polyfillSet].some(({name}) => name === "fetch");

				// If the Zone-patching of 'fetch' is requested, or if 'fetch' is requested as a polyfill along with Zone add it to the polyfill buffer for Zone.js
				if (hasFetchPolyfill || (polyfillFeature.meta != null && polyfillFeature.meta.fetch === true)) {
					for (const fetchPath of ensureArray(meta.fetch)) {
						const fetchExtensionPathInput = join(rootDirectory, fetchPath);
						const resolvedFetchExtensionPath = sync(fetchExtensionPathInput, SYNC_OPTIONS);
						if (resolvedFetchExtensionPath != null) {
							absolutePaths.push(resolvedFetchExtensionPath);
						} else {
							this.logger.debug(`Unresolved path:`, fetchExtensionPathInput);
						}
					}
				}

				// Check if any fetch polyfill has been requested
				const hasResizeObserverPolyfill = [...polyfillSet].some(({name}) => name === "resize-observer");

				// If the Zone-patching of 'ResizeObserver' is requested or if ResizeObserver is requested as a polyfill along with Zone.js, add it to the polyfill buffer for Zone.js
				if (hasResizeObserverPolyfill || (polyfillFeature.meta != null && polyfillFeature.meta.resizeobserver === true)) {
					for (const resizeobserverPath of ensureArray(meta.resizeobserver)) {
						const resizeObserverExtensionPathInput = join(rootDirectory, resizeobserverPath);
						const resolvedResizeObserverExtensionPath = sync(resizeObserverExtensionPathInput, SYNC_OPTIONS);
						if (resolvedResizeObserverExtensionPath != null) {
							absolutePaths.push(resolvedResizeObserverExtensionPath);
						} else {
							this.logger.debug(`Unresolved path:`, resizeObserverExtensionPathInput);
						}
					}
				}
			}

			// If the Polyfill is "intl.core" and a localeDir is associated with it, also resolve the requested locales (if any)
			if (polyfillFeature.name.startsWith("intl.") && meta != null && "localeDir" in meta && polyfillFeature.meta.locale != null) {
				// Normalize the requested locales to make sure we have an array to work with
				const requestedLocales: string[] = ensureArray(polyfillFeature.meta.locale);

				// Loop through all of the requested locales in parallel
				await Promise.all(
					requestedLocales.map(async requestedLocale => {
						// Resolve the absolute path
						for (const localeDir of ensureArray(meta.localeDir)) {
							const localePathInput = join(rootDirectory, localeDir, `${requestedLocale}.js`);
							const resolvedLocalePath = sync(localePathInput, SYNC_OPTIONS);
							if (resolvedLocalePath != null) {
								absolutePaths.push(resolvedLocalePath);
							} else {
								this.logger.debug(`Unresolved path:`, localePathInput);
							}
						}
					})
				);
			}

			// Push all of the absolute paths for this specific polyfill to the input paths
			input.push({
				polyfillName: polyfillFeature.name,
				paths: absolutePaths,
				flatten
			});
		}

		// Load all of the input paths and add them to the generated content
		for (const {paths, flatten} of input) {
			if (flatten) {
				content += `\n${await this.flattener.flatten({
					path: paths
				})}`;
			} else {
				for (const path of paths) {
					content += `\n${(await this.fileLoader.load(path)).toString()}`;
				}
			}
		}

		// Minify the result
		const minified = Buffer.from(await this.minifier.minify({code: Buffer.from(content)}));
		// Compress the result
		const {brotli, zlib} = await this.compressor.compress(minified);

		// Return all of the Buffers
		return {
			brotli,
			minified,
			zlib
		};
	}

	/**
	 * Returns true if the given polyfill feature is core-js
	 * @param {IPolyfillFeature} polyfillFeature
	 * @returns {boolean}
	 */
	private isCoreJs(polyfillFeature: IPolyfillFeature): boolean {
		const match = constant.polyfill[polyfillFeature.name];
		return "library" in match && match.library === "core-js";
	}
}
