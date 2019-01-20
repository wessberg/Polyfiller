import {IPolyfillFeatureInput} from "./i-polyfill-feature";
import {ContentEncodingKind} from "../encoding/content-encoding-kind";

export interface IPolyfillRequest {
	userAgent: string;
	encoding?: ContentEncodingKind;
	features: Set<IPolyfillFeatureInput>;
}
