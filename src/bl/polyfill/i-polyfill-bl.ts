import {IPolyfillRequest} from "../../polyfill/i-polyfill-request";
import {IGetPolyfillsResult} from "./i-get-polyfills-result";

export interface IPolyfillBl {
	getPolyfills(request: IPolyfillRequest): Promise<IGetPolyfillsResult>;
}
