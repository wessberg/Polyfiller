import {IMinifyService} from "./i-minify-service";
import {IMinifyServiceOptions} from "./i-minify-service-options";
// @ts-ignore
import {transform} from "@babel/core";

/**
 * A class that helps with minifying code
 */
export class MinifyService implements IMinifyService {
	/**
	 * Minifies the given code based on the given options
	 * @param {IMinifyServiceOptions} options
	 * @returns {string}
	 */
	public async minify(options: IMinifyServiceOptions): Promise<string> {
		const result = await transform(options.code, {
			configFile: false,
			babelrc: false,
			babelrcRoots: false,
			code: true,
			comments: false,
			compact: true,
			filename: "",
			filenameRelative: "",
			sourceMaps: false,
			root: "",
			presets: [],
			plugins: ["@babel/plugin-transform-block-scoping"]
		});
		return result.code;
	}
}
