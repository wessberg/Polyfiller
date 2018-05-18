import {IBabelMinifyOptions} from "./i-babel-minify-options";

export const babelMinifyOptions: IBabelMinifyOptions = {
	// Until https://github.com/babel/minify/issues/820 is resolved
	evaluate: false
};