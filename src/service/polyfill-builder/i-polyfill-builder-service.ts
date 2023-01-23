import type {PolyfillFeature} from "../../polyfill/polyfill-feature.js";
import type {ICompressedPolyfillSetResult} from "./i-compressed-polyfill-set-result.js";
import type {PolyfillRequest} from "../../polyfill/polyfill-request.js";

export interface IPolyfillBuilderService {
	buildPolyfillSet(polyfillSet: Set<PolyfillFeature>, request: PolyfillRequest): Promise<ICompressedPolyfillSetResult>;
}
