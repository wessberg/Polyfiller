import {IPolyfillFeature} from "../polyfill/i-polyfill-feature";
import {PolyfillContext} from "../polyfill/polyfill-context";
import {EcmaVersion} from "../util/type/ecma-version";

export interface BuildOptions {
	context: PolyfillContext;
	features: IPolyfillFeature[];
	featuresRequested: IPolyfillFeature[];
	ecmaVersion: EcmaVersion;
	paths: string[];
	sourcemap?: boolean;
	minify?: boolean;
	userAgent?: string;
}
