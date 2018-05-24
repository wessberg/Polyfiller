import {IPolyfillRequest} from "../../polyfill/i-polyfill-request";
import {IRegistryGetResult} from "../../service/registry/polyfill-registry/i-registry-get-result";

export interface IPolyfillBl {
	getPolyfills (request: IPolyfillRequest): Promise<IRegistryGetResult>;
}