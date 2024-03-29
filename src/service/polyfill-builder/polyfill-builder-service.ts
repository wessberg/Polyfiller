import type {IPolyfillBuilderService} from "./i-polyfill-builder-service.js";
import {constant} from "../../constant/constant.js";
import type {PolyfillFeature} from "../../polyfill/polyfill-feature.js";
import {join, dirname} from "crosspath";
import type {ICompressedPolyfillSetResult} from "./i-compressed-polyfill-set-result.js";
import {findUpSync} from "find-up";
import {build} from "../../build/build.js";
import type {IPolyfillDictEntryBase} from "../../polyfill/polyfill-dict.js";
import type {PolyfillContext} from "../../polyfill/polyfill-context.js";
import type {PolyfillRequest} from "../../polyfill/polyfill-request.js";
import {ensureArray} from "../../api/util.js";
import {fileURLToPath} from "url";
const SYNC_OPTIONS = {cwd: dirname(fileURLToPath(import.meta.url)), type: "file"} as const;

function normalizeLocale(locale: string): string {
	switch (locale) {
		// nb and no are identical languages from a data perspective
		case "no":
			return "nb";
		default:
			return locale;
	}
}

function selectMetaPaths<Meta extends Exclude<IPolyfillDictEntryBase["meta"], undefined>>(value: Meta[keyof Meta], context: PolyfillContext): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value;
	return ensureArray((value as never)[context]);
}

/**
 * A service that can load and cache all polyfills
 */
export class PolyfillBuilderService implements IPolyfillBuilderService {
	/**
	 * Builds the given PolyfillSet and returns the result in all encodings
	 */
	async buildPolyfillSet(polyfillSet: Set<PolyfillFeature>, request: PolyfillRequest): Promise<ICompressedPolyfillSetResult> {
		const paths: string[] = [];

		for (const polyfillFeature of polyfillSet) {
			const absolutePaths: string[] = [];
			const match = constant.polyfill[polyfillFeature.name];
			if (match == null || "polyfills" in match) {
				throw new TypeError(`No aliased polyfill names can be built! These must be resolved before calling ${this.buildPolyfillSet.name}!`);
			}

			const rootDirectory = "library" in match ? join("node_modules", typeof match.library === "string" ? match.library : match.library[request.context]) : "";

			const localPaths =
				"library" in match
					? Array.isArray(match.relativePaths)
						? match.relativePaths
						: match.relativePaths[request.context]
					: Array.isArray(match.localPaths)
					? match.localPaths
					: match.localPaths[request.context];

			const {meta} = match;

			// If SystemJS is requested, the variant to use may be provided as metadata. If so, we should use that one, rather than the relativePaths
			if (
				polyfillFeature.name === "systemjs" &&
				meta != null &&
				polyfillFeature.meta != null &&
				"variant" in polyfillFeature.meta &&
				(polyfillFeature.meta.variant === "s" || polyfillFeature.meta.variant === "system")
			) {
				for (const variant of selectMetaPaths(meta[polyfillFeature.meta.variant], request.context)) {
					const metaVariantPathInput = join(rootDirectory, variant);
					const resolvedMetaVariantPath = findUpSync(metaVariantPathInput, SYNC_OPTIONS);
					if (resolvedMetaVariantPath != null) {
						absolutePaths.push(resolvedMetaVariantPath);
					} else {
						throw new ReferenceError(`Unresolved path: '${metaVariantPathInput}'`);
					}
				}
			} else if (
				polyfillFeature.name === "shadow-dom" &&
				meta != null &&
				polyfillFeature.meta != null &&
				"experimental" in polyfillFeature.meta &&
				polyfillFeature.meta.experimental === true
			) {
				for (const variant of selectMetaPaths(meta.experimental, request.context)) {
					const metaVariantPathInput = join(rootDirectory, variant);
					const resolvedMetaVariantPath = findUpSync(metaVariantPathInput, SYNC_OPTIONS);
					if (resolvedMetaVariantPath != null) {
						absolutePaths.push(resolvedMetaVariantPath);
					} else {
						throw new ReferenceError(`Unresolved path: '${metaVariantPathInput}'`);
					}
				}
			}

			// Otherwise, use all of the given relativePaths
			else {
				// For each of the relative paths, compute the absolute path
				for (const path of localPaths) {
					const pathInput = join(rootDirectory, path);
					const resolvedPath = findUpSync(pathInput, SYNC_OPTIONS);
					if (resolvedPath != null) {
						absolutePaths.push(resolvedPath);
					} else {
						throw new ReferenceError(`Unresolved path: '${pathInput}'`);
					}
				}
			}

			if (meta != null && polyfillFeature.name === "shadow-dom" && polyfillFeature.meta?.lit === true) {
				for (const filePath of selectMetaPaths(meta.lit, request.context)) {
					const filePathInput = join(rootDirectory, filePath);
					const resolvedFilePath = findUpSync(filePathInput, SYNC_OPTIONS);
					if (resolvedFilePath != null) {
						absolutePaths.push(resolvedFilePath);
					} else {
						throw new ReferenceError(`Unresolved path: '${filePathInput}'`);
					}
				}
			}

			if (meta != null && polyfillFeature.name === "zone") {
				// If Zone is requested, 'zone-error' may be requested which improves the produced Stack trace when using Zone
				if (polyfillFeature.meta != null && polyfillFeature.meta.error === true) {
					for (const errorPath of selectMetaPaths(meta.error, request.context)) {
						const errorPathInput = join(rootDirectory, errorPath);
						const resolvedErrorPath = findUpSync(errorPathInput, SYNC_OPTIONS);
						if (resolvedErrorPath != null) {
							absolutePaths.push(resolvedErrorPath);
						} else {
							throw new ReferenceError(`Unresolved path: '${errorPathInput}'`);
						}
					}
				}

				// If any web component polyfill has been requested, or if the 'shadydom' zone extension has been explicitly requested
				// add it to the Zone.js polyfill buffer
				if (polyfillFeature.meta != null && polyfillFeature.meta.shadydom === true) {
					for (const shadydomPath of selectMetaPaths(meta.shadydom, request.context)) {
						const shadyDomExtensionPathInput = join(rootDirectory, shadydomPath);
						const resolvedShadyDomExtensionPath = findUpSync(shadyDomExtensionPathInput, SYNC_OPTIONS);
						if (resolvedShadyDomExtensionPath != null) {
							absolutePaths.push(resolvedShadyDomExtensionPath);
						} else {
							throw new ReferenceError(`Unresolved path: '${shadyDomExtensionPathInput}'`);
						}
					}
				}

				// If the Zone-patching of 'matchMedia' is requested, add it to the polyfill buffer for Zone.js
				if (polyfillFeature.meta != null && polyfillFeature.meta.mediaquery === true) {
					for (const mediaqueryPath of selectMetaPaths(meta.mediaquery, request.context)) {
						const mediaQueryExtensionPathInput = join(rootDirectory, mediaqueryPath);
						const resolvedMediaQueryExtensionPath = findUpSync(mediaQueryExtensionPathInput, SYNC_OPTIONS);
						if (resolvedMediaQueryExtensionPath != null) {
							absolutePaths.push(resolvedMediaQueryExtensionPath);
						} else {
							throw new ReferenceError(`Unresolved path: '${mediaQueryExtensionPathInput}'`);
						}
					}
				}

				// If the Zone-patching of 'fetch' is requested, or if 'fetch' is requested as a polyfill along with Zone add it to the polyfill buffer for Zone.js
				if (polyfillFeature.meta != null && polyfillFeature.meta.fetch === true) {
					for (const fetchPath of selectMetaPaths(meta.fetch, request.context)) {
						const fetchExtensionPathInput = join(rootDirectory, fetchPath);
						const resolvedFetchExtensionPath = findUpSync(fetchExtensionPathInput, SYNC_OPTIONS);
						if (resolvedFetchExtensionPath != null) {
							absolutePaths.push(resolvedFetchExtensionPath);
						} else {
							throw new ReferenceError(`Unresolved path: '${fetchExtensionPathInput}'`);
						}
					}
				}

				// If the Zone-patching of 'ResizeObserver' is requested or if ResizeObserver is requested as a polyfill along with Zone.js, add it to the polyfill buffer for Zone.js
				if (polyfillFeature.meta != null && polyfillFeature.meta.resizeobserver === true) {
					for (const resizeobserverPath of selectMetaPaths(meta.resizeobserver, request.context)) {
						const resizeObserverExtensionPathInput = join(rootDirectory, resizeobserverPath);
						const resolvedResizeObserverExtensionPath = findUpSync(resizeObserverExtensionPathInput, SYNC_OPTIONS);
						if (resolvedResizeObserverExtensionPath != null) {
							absolutePaths.push(resolvedResizeObserverExtensionPath);
						} else {
							throw new ReferenceError(`Unresolved path: '${resizeObserverExtensionPathInput}'`);
						}
					}
				}
			}

			// If the Polyfill is related to intl and a localeDir is associated with it, also resolve the requested locales (if any)
			if (polyfillFeature.name.startsWith("intl.") && meta != null && "localeDir" in meta && polyfillFeature.meta.locale != null) {
				// Normalize the requested locales to make sure we have an array to work with
				const requestedLocales: string[] = ensureArray(polyfillFeature.meta.locale);

				// Loop through all of the requested locales in parallel
				await Promise.all(
					requestedLocales.map(async requestedLocale => {
						// Resolve the absolute path
						for (const localeDir of selectMetaPaths(meta.localeDir, request.context)) {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const locale = new (Intl as any).Locale(requestedLocale);
							let addedLocale = false;
							for (const currentLocale of new Set([locale.baseName, normalizeLocale(locale.baseName), locale.language, normalizeLocale(locale.language)])) {
								const localePathInput = join(rootDirectory, localeDir, `${currentLocale}.js`);
								const resolvedLocalePath = findUpSync(localePathInput, SYNC_OPTIONS);
								if (resolvedLocalePath != null) {
									addedLocale = true;
									absolutePaths.push(resolvedLocalePath);
									break;
								}
							}

							if (!addedLocale) {
								throw new ReferenceError(`Unresolved locale: '${requestedLocale}'`);
							}
						}
					})
				);
			}

			// Push all of the absolute paths for this specific polyfill to the input paths
			paths.push(...absolutePaths);
		}

		const {brotli, zlib, raw} = await build({
			context: request.context,
			userAgent: request.userAgent,
			browserslist: request.browserslist,
			ecmaVersion: request.ecmaVersion,
			module: request.module,
			featuresRequested: [...request.features],
			paths: [...new Set(paths)],
			features: [...polyfillSet],
			minify: request.minify,
			sourcemap: request.sourcemap
		});

		// Return all of the Buffers
		return {
			brotli,
			minified: raw,
			zlib
		};
	}
}
