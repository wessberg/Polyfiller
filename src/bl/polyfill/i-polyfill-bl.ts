import type {PolyfillRequest} from "../../polyfill/polyfill-request.js";
import type {PolyfillResponse} from "../../polyfill/polyfill-response.js";

export interface IPolyfillBl {
	getPolyfills(request: PolyfillRequest): Promise<PolyfillResponse>;
}
