import {BuildOptions} from "./build-options";
import {BuildResult} from "./build-result";
import {generateBrowserslistFromUseragent, getAppropriateEcmaVersionForBrowserslist} from "@wessberg/browserslist-generator";
import {brotliEncode, gzipEncode} from "./util/encoding";
import {BROTLI_OPTIONS} from "./options/brotli-options";
import {ZLIB_OPTIONS} from "./options/zlib-options";
import {IPolyfillFeature} from "../polyfill/i-polyfill-feature";
import {build as esbuild} from "esbuild";
import {transform} from "@swc/core";
import {tmpdir} from "os";
import {join} from "path";
import {generateRandomHash} from "../util/hash-util/hash-util";
import {unlinkSync, writeFileSync} from "fs";

function stringifyPolyfillFeature(feature: IPolyfillFeature): string {
	const metaEntries = Object.entries(feature.meta);
	const metaEntriesText = metaEntries
		.filter(([key, value]) => key !== "force" || value === true)
		.map(([key, value]) => `${key}: ${Array.isArray(value) ? JSON.stringify(value) : value}`)
		.join(",");
	return `${feature.name}${metaEntriesText.length === 0 ? "" : ` (${metaEntriesText})`}`;
}

export async function build({paths, features, featuresRequested, userAgent, context, sourcemap = false, minify = false}: BuildOptions): Promise<BuildResult> {
	const entryText = paths.map(path => `import "${path}";`).join("\n");

	// Generate the intro text
	const featuresRequestedText = featuresRequested.length < 1 ? `No features requested` : `Features requested: ${featuresRequested.map(stringifyPolyfillFeature).join(", ")}`;
	const polyfillsAppliedText = features.length < 1 ? `No polyfills applied` : `Polyfills applied (in order): ${features.map(stringifyPolyfillFeature).join(", ")}`;

	const banner = `\
/**
 * ${featuresRequestedText}
 *
 * ${polyfillsAppliedText}
 * @preserve
 */
`;
	const tempInputFileLocation = join(tmpdir(), `${generateRandomHash()}.js`);
	const virtualOutputFileName = "bundle.js";

	writeFileSync(tempInputFileLocation, entryText);

	let ecmaVersion = userAgent == null ? "es3" : getAppropriateEcmaVersionForBrowserslist(generateBrowserslistFromUseragent(userAgent));

	// esbuild only supports transforming down to es2015
	const canUseOnlyEsbuild = ecmaVersion !== "es3" && ecmaVersion !== "es5";

	try {
		const result = await esbuild({
			write: false,
			format: "iife",
			outfile: virtualOutputFileName,
			platform: context === "node" ? "node" : "browser",
			bundle: true,
			target: "esnext",
			mainFields: context === "node" ? ["module", "es2015", "main"] : ["browser", "module", "es2015", "main"],
			sourcemap,
			entryPoints: [tempInputFileLocation],
			...(canUseOnlyEsbuild
				? {
						minify,
						target: ecmaVersion,
						sourcemap: sourcemap ? "inline" : false
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
		let map = mapOutputFile == null ? undefined : Buffer.from(mapOutputFile.contents).toString("utf8");

		// We might need to apply transformations in a separate step using swc if the target is ES5 or below
		if (!canUseOnlyEsbuild) {
			// swc doesn't support es2020 as a target
			if (ecmaVersion === "es2020") {
				ecmaVersion = "es2019";
			}

			({code, map} = await transform(code, {
				sourceMaps: sourcemap ? "inline" : false,
				inputSourceMap: map,
				minify,
				filename: virtualOutputFileName,
				jsc: {
					target: ecmaVersion
				}
			}));
		}

		if (!sourcemap) {
			code = `${banner}${code}`;
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
