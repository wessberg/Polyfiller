import {IMinifyService} from "./i-minify-service";
import {IMinifyServiceOptions} from "./i-minify-service-options";
import {IBabelMinifyOptions} from "./i-babel-minify-options";
// @ts-ignore
import minify from "babel-minify";

/**
 * A class that helps with minifying code
 */
export class MinifyService implements IMinifyService {
	constructor (private readonly minifyOptions: IBabelMinifyOptions) {
	}

	/**
	 * Minifies the given code based on the given options
	 * @param {IMinifyServiceOptions} options
	 * @returns {string}
	 */
	public minify (options: IMinifyServiceOptions): string {
		const {code} = minify(options.code.toString(), this.minifyOptions, {sourceMaps: false});
		return code;
	}

}