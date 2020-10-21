import {IPolyfillFeature} from "../../polyfill/i-polyfill-feature";
import {ICompressedPolyfillSetResult} from "./i-compressed-polyfill-set-result";
import {IPolyfillRequest} from "../../polyfill/i-polyfill-request";

export interface IPolyfillBuilderService {
	buildPolyfillSet(polyfillSet: Set<IPolyfillFeature>, request: IPolyfillRequest): Promise<ICompressedPolyfillSetResult>;
}
