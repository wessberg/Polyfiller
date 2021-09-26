import {PolyfillFeatureInput} from "./polyfill-feature";
import {ContentEncodingKind} from "../encoding/content-encoding-kind";
import {PolyfillContext} from "./polyfill-context";
import {EcmaVersion} from "../util/type/ecma-version";

export interface PolyfillRequest {
	// If true, the output will be in ESM-format
	module: boolean;
	userAgent: string | undefined;
	browserslist: string[];
	ecmaVersion: EcmaVersion;
	encoding?: ContentEncodingKind;
	features: Set<PolyfillFeatureInput>;
	sourcemap: boolean;
	minify: boolean;
	context: PolyfillContext;
}
