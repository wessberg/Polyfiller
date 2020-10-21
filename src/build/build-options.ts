import {IPolyfillFeature} from "../polyfill/i-polyfill-feature";
import {PolyfillContext} from "../polyfill/polyfill-context";

export interface BuildOptions {
	context: PolyfillContext;
	features: IPolyfillFeature[];
	featuresRequested: IPolyfillFeature[];
	paths: string[];
	sourcemap?: boolean;
	minify?: boolean;
	userAgent?: string;
}
