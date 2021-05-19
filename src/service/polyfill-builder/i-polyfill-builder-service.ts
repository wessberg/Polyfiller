import {PolyfillFeature} from "../../polyfill/polyfill-feature";
import {ICompressedPolyfillSetResult} from "./i-compressed-polyfill-set-result";
import {PolyfillRequest} from "../../polyfill/polyfill-request";

export interface IPolyfillBuilderService {
	buildPolyfillSet(polyfillSet: Set<PolyfillFeature>, request: PolyfillRequest): Promise<ICompressedPolyfillSetResult>;
}
