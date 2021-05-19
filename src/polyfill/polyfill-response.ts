import {PolyfillFeature} from "./polyfill-feature";

export interface PolyfillResponse {
	buffer: Buffer;
	checksum: string;
	featureSet: Set<PolyfillFeature>;
}
