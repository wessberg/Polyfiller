import type {PolyfillFeature} from "../polyfill/polyfill-feature.js";
import type {PolyfillContext} from "../polyfill/polyfill-context.js";
import type {EcmaVersion} from "../util/type/ecma-version.js";

export interface BuildOptions {
	context: PolyfillContext;
	features: PolyfillFeature[];
	featuresRequested: PolyfillFeature[];
	browserslist: string[];
	module: boolean;
	ecmaVersion: EcmaVersion;
	paths: string[];
	sourcemap?: boolean;
	minify?: boolean;
	userAgent?: string;
}
