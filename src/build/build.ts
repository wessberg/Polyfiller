import type {BuildOptions} from "./build-options.js";
import type {BuildResult} from "./build-result.js";
import {brotliEncode, gzipEncode} from "./util/encoding.js";
import {BROTLI_OPTIONS} from "./options/brotli-options.js";
import {ZLIB_OPTIONS} from "./options/zlib-options.js";
import type {PolyfillFeature} from "../polyfill/polyfill-feature.js";
import {build as esbuild} from "esbuild";
import {tmpdir} from "os";
import {join, normalize} from "crosspath";
import {unlinkSync, writeFileSync} from "fs";
import {transform as swc} from "@swc/core";
import {transformAsync as babel} from "@babel/core";
import {generateRandomHash} from "../api/util.js";
import pluginTransformInlineRegenerator from "./plugin/babel/plugin-transform-inline-regenerator.js";

function stringifyPolyfillFeature(feature: PolyfillFeature): string {
	const metaEntries = Object.entries(feature.meta);
	const metaEntriesText = metaEntries
		.filter(([key, value]) => key !== "force" || value === true)
		.map(([key, value]) => `${key}: ${Array.isArray(value) ? JSON.stringify(value) : value}`)
		.join(",");
	return `${feature.name}${metaEntriesText.length === 0 ? "" : ` (${metaEntriesText})`}`;
}

export async function build({paths, features, browserslist, ecmaVersion, context, module, sourcemap = false, minify = false}: BuildOptions): Promise<BuildResult> {
	const entryText = paths.map(path => `import "${normalize(path)}";`).join("\n");

	// Generate the intro text
	const polyfillsAppliedText = features.length < 1 ? `No polyfills applied` : `Polyfills applied (in order): ${features.map(stringifyPolyfillFeature).join(", ")}`;

	const banner = `\
/**
 * ${polyfillsAppliedText}
 * @preserve
 */
`;
	const tempInputFileLocation = join(tmpdir(), `${generateRandomHash()}.js`);
	const virtualOutputFileName = "bundle.js";

	writeFileSync(tempInputFileLocation, entryText);

	// esbuild only supports transforming down to es2015
	const canUseOnlyEsbuild = ecmaVersion !== "es3" && ecmaVersion !== "es5";

	// swc is still a bit too unstable for production use
	const canUseSwc = false;

	// With babel, input sourcemaps are so slow that it actually leads to the JavaScript heap being exceeded and very slow transpilation times.
	const canUseSourcemaps = sourcemap && (canUseOnlyEsbuild || canUseSwc);

	const format = module ? "esm" : "iife";

	try {
		const result = await esbuild({
			format,
			banner: {
				js: banner
			},
			write: false,

			outfile: virtualOutputFileName,
			platform: context === "node" ? "node" : "browser",
			bundle: true,
			target: "esnext",
			mainFields: context === "node" ? ["module", "es2015", "main"] : ["browser", "module", "es2015", "main"],
			sourcemap: canUseSourcemaps ? (canUseOnlyEsbuild ? "inline" : true) : false,
			entryPoints: [tempInputFileLocation],
			...(canUseOnlyEsbuild
				? {
						minify,
						target: ecmaVersion
				  }
				: {})
		});
		const outputFiles = result.outputFiles ?? [];
		const codeOutputFile = outputFiles.find(({path}) => path.endsWith(".js"));
		const mapOutputFile = outputFiles.find(({path}) => path.endsWith(".map"));

		if (codeOutputFile == null) {
			throw new ReferenceError(`Internal Error: No output file was generated`);
		}

		let code = Buffer.from(codeOutputFile.contents).toString("utf8");
		const map = mapOutputFile == null ? undefined : Buffer.from(mapOutputFile.contents).toString("utf8");

		if (!canUseOnlyEsbuild) {
			if (canUseSwc) {
				({code} = await swc(code, {
					minify,
					sourceMaps: sourcemap ? "inline" : false,
					inputSourceMap: map,
					isModule: format === "esm",
					...(format === "esm"
						? {
								module: {
									type: "es6" as "amd"
								}
						  }
						: {}),
					filename: virtualOutputFileName,
					jsc: {
						target: ecmaVersion
					}
				}));
			} else {
				const babelResult =
					(await babel(code, {
						compact: minify,
						minified: minify,
						comments: !minify,
						sourceMaps: canUseSourcemaps ? "inline" : false,
						// Unfortunately, input sourcemaps are quite slow in Babel and sometimes exceed the JavaScript heap
						inputSourceMap: false as unknown as undefined, // map == null ? undefined : JSON.parse(map),
						sourceType: format === "esm" ? "module" : "script",
						filename: virtualOutputFileName,
						plugins: [pluginTransformInlineRegenerator],
						presets: [
							[
								"@babel/preset-env",
								{
									// core-js breaks when typeof are transformed into the _typeof helper, so we will have to turn off this plugin.
									// this is a good thing anyway since polyfills should be treated as close to their original definitions as possible
									exclude: ["transform-typeof-symbol"],
									targets: browserslist,
									modules: format === "esm" ? false : "auto"
								}
							]
						]
					})) ?? {};
				if (babelResult.code != null) {
					code = babelResult.code;
				}
			}
		}

		// Apply encoding based on the given options
		const raw = Buffer.from(code);
		const brotli = await brotliEncode(raw, BROTLI_OPTIONS);
		const zlib = await gzipEncode(raw, ZLIB_OPTIONS);
		return {
			brotli,
			zlib,
			raw
		};
	} finally {
		unlinkSync(tempInputFileLocation);
	}
}
