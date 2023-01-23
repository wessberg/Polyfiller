import type {PolyfillFeature} from "./polyfill-feature.js";

export interface PolyfillResponse {
	buffer: Buffer;
	checksum: string;
	featureSet: Set<PolyfillFeature>;
}
