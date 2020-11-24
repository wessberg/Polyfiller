import {IPolyfillFeatureInput} from "./i-polyfill-feature";
import {ContentEncodingKind} from "../encoding/content-encoding-kind";
import {PolyfillContext} from "./polyfill-context";
import {EcmaVersion} from "../util/type/ecma-version";

export interface IPolyfillRequest {
	userAgent: string;
	ecmaVersion: EcmaVersion;
	encoding?: ContentEncodingKind;
	features: Set<IPolyfillFeatureInput>;
	sourcemap: boolean;
	minify: boolean;
	context: PolyfillContext;
}
