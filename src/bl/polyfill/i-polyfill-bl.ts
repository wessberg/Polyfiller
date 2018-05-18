import {IPolyfillRequest} from "../../polyfill/i-polyfill-request";

export interface IPolyfillBl {
	getPolyfills (request: IPolyfillRequest): Promise<Buffer>;
}