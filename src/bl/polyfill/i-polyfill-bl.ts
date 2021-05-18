import {PolyfillRequest} from "../../polyfill/polyfill-request";
import {PolyfillResponse} from "../../polyfill/polyfill-response";

export interface IPolyfillBl {
	getPolyfills(request: PolyfillRequest): Promise<PolyfillResponse>;
}
