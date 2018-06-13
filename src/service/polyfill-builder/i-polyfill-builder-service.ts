import {IPolyfillFeature} from "../../polyfill/i-polyfill-feature";
import {ICompressedPolyfillSetResult} from "./i-compressed-polyfill-set-result";

export interface IPolyfillBuilderService {
	buildPolyfillSet (polyfillSet: Set<IPolyfillFeature>): Promise<ICompressedPolyfillSetResult>;
}