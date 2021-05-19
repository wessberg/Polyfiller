import {PolyfillFeature} from "../polyfill/polyfill-feature";
import {PolyfillContext} from "../polyfill/polyfill-context";
import {EcmaVersion} from "../util/type/ecma-version";

export interface BuildOptions {
	context: PolyfillContext;
	features: PolyfillFeature[];
	featuresRequested: PolyfillFeature[];
	ecmaVersion: EcmaVersion;
	paths: string[];
	sourcemap?: boolean;
	minify?: boolean;
	userAgent?: string;
}
