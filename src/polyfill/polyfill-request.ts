import type {PolyfillFeatureInput} from "./polyfill-feature.js";
import type {ContentEncodingKind} from "../encoding/content-encoding-kind.js";
import type {PolyfillContext} from "./polyfill-context.js";
import type {EcmaVersion} from "../util/type/ecma-version.js";

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
