import {IMinifyService} from "./i-minify-service";
import {IMinifyServiceOptions} from "./i-minify-service-options";
import {transformAsync} from "@babel/core";

/**
 * A class that helps with minifying code
 */
export class MinifyService implements IMinifyService {
	/**
	 * Minifies the given code based on the given options
	 */
	async minify(options: IMinifyServiceOptions): Promise<string> {
		const result = await transformAsync(options.code, {
			configFile: false,
			babelrc: false,
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
		return result!.code!;
	}
}
