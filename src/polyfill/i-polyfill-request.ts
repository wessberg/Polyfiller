import {IPolyfillFeatureInput} from "./i-polyfill-feature";
import {ContentEncodingKind} from "../encoding/content-encoding-kind";
import {PolyfillContext} from "./polyfill-context";

export interface IPolyfillRequest {
	userAgent: string;
	encoding?: ContentEncodingKind;
	features: Set<IPolyfillFeatureInput>;
	sourcemap: boolean;
	minify: boolean;
	context: PolyfillContext;
}
