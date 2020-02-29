import {IFlattenerService} from "./i-flattener-service";
import {IFlattenerOptions} from "./i-flattener-options";
import {generate} from "astring";
import {rollup} from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import multiEntry from "@rollup/plugin-multi-entry";

/**
 * A service that can flatten the given code into a single file
 */
export class FlattenerService implements IFlattenerService {
	/**
	 * Flattens the given code into a single file based on the given options
	 *
	 * @param options
	 * @return
	 */
	async flatten({path, transform}: IFlattenerOptions): Promise<string> {
		const paths = Array.isArray(path) ? path : [path];
		if (paths.length < 1) return "";

		const bundle = await rollup({
			input: paths,
			context: "this",
			plugins: [
				multiEntry(),
				{
					name: "transformer",
					transform(code: string, id: string) {
						if (transform == null) return;

						const result = transform.call(this, code, id);
						if (result == null) return result;

						return {
							code: generate(result),
							map: {mappings: ""}
						};
					}
				},
				nodeResolve({
					mainFields: ["module", "jsnext", "main"]
				}),
				commonjs()
			]
		});

		const bundleSet = await bundle.generate({
			format: "iife",
			name: paths[0],
			sourcemap: false
		});

		// Produce a flattened bundle
		let flattened = bundleSet.output.map(file => ("source" in file ? file.source.toString() : file.code)).join("\n");

		// If the IIFE is named, make sure to remove its outer declaration. We only care about the side-effects
		const indexOfIife = flattened.indexOf("(function");
		if (indexOfIife >= 0) {
			flattened = flattened.slice(indexOfIife);
		}

		return flattened;
	}
}
