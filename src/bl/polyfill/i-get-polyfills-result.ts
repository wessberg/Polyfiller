import {IRegistryGetResult} from "../../service/registry/polyfill-registry/i-registry-get-result";
import {IPolyfillFeature} from "../../polyfill/i-polyfill-feature";

export interface IGetPolyfillsResult {
	result: IRegistryGetResult;
	featureSet: Set<IPolyfillFeature>;
}