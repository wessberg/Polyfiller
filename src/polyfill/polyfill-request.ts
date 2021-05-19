import {PolyfillFeatureInput} from "./polyfill-feature";
import {ContentEncodingKind} from "../encoding/content-encoding-kind";
import {PolyfillContext} from "./polyfill-context";
import {EcmaVersion} from "../util/type/ecma-version";

export interface PolyfillRequest {
	userAgent: string | undefined;
	ecmaVersion: EcmaVersion;
	encoding?: ContentEncodingKind;
	features: Set<PolyfillFeatureInput>;
	sourcemap: boolean;
	minify: boolean;
	context: PolyfillContext;
}
