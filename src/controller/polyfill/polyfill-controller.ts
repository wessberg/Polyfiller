import {IPolyfillController} from "./i-polyfill-controller";
import {Controller} from "../controller/controller";
import {Request} from "../../server/i-request";
import {Response} from "../../server/i-response";
import {GET} from "../../server/decorator/get";
import {constants} from "http2";
import {OK, INTERNAL_SERVER_ERROR} from "http-status-codes";
import {constant} from "../../constant/constant";
import {getPolyfillRequestFromUrl} from "../../util/polyfill/polyfill-util";
import {IPolyfillBl} from "../../bl/polyfill/i-polyfill-bl";
import {pickEncoding} from "../../util/request-util/request-util";
import {generateErrorHtml} from "../../util/html/generate-html";

/**
 * A controller that can respond to requests for polyfills
 */
export class PolyfillController extends Controller implements IPolyfillController {

	constructor (private readonly polyfillBl: IPolyfillBl) {
		super();
	}

	/**
	 * Called when the polyfill (/polyfill) endpoint is requested
	 * @param {Request} request
	 * @returns {Promise<Response>}
	 */
	@GET({path: constant.endpoint.polyfill})
	public async onPolyfillRequested (request: Request): Promise<Response> {
		// Normalize the polyfill request
		const polyfillRequest = getPolyfillRequestFromUrl(request.url, request.userAgent, pickEncoding(request.acceptEncoding));

		// Generate polyfill bundle
		try {
			const bundle = await this.polyfillBl.getPolyfills(polyfillRequest);
			// Return an OK
			return {
				contentType: "application/javascript",
				statusCode: request.http2
					? constants.HTTP_STATUS_OK
					: OK,
				body: bundle,
				cacheControl: "immutable",
				contentEncoding: polyfillRequest.encoding
			};
		} catch (ex) {
			// Respond with error code 500
			const statusCode = request.http2
				? constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
				: INTERNAL_SERVER_ERROR;

			return {
				contentType: "text/html",
				statusCode,
				body: generateErrorHtml(ex, statusCode)
			};
		}
	}

}