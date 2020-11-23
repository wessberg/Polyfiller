import {IPolyfillController} from "./i-polyfill-controller";
import {Controller} from "../controller/controller";
import {Request} from "../../server/i-request";
import {Response} from "../../server/i-response";
import {GET} from "../../server/decorator/get";
import {constants} from "http2";
import {OK, INTERNAL_SERVER_ERROR, NOT_MODIFIED} from "http-status-codes";
import {constant} from "../../constant/constant";
import {encodeFeatureSetForHttpHeader, getPolyfillRequestFromUrl} from "../../util/polyfill/polyfill-util";
import {IPolyfillBl} from "../../bl/polyfill/i-polyfill-bl";
import {pickEncoding} from "../../util/request-util/request-util";
import {generateErrorHtml} from "../../util/html/generate-html";

/**
 * A controller that can respond to requests for polyfills
 */
export class PolyfillController extends Controller implements IPolyfillController {
	constructor(private readonly polyfillBl: IPolyfillBl) {
		super();
	}

	/**
	 * Called when the polyfill (/polyfill) endpoint is requested
	 *
	 * @param request
	 * @returns
	 */
	@GET({path: constant.endpoint.polyfill})
	async onPolyfillRequested(request: Request): Promise<Response> {
		// Normalize the polyfill request
		const polyfillRequest = getPolyfillRequestFromUrl(request.url, request.userAgent, pickEncoding(request.acceptEncoding));

		// Generate polyfill bundle
		try {
			const {
				result: {buffer, checksum},
				featureSet
			} = await this.polyfillBl.getPolyfills(polyfillRequest);

			// If the cached checksum (ETag) is identical, respond with NOT_MODIFIED
			if (request.cachedChecksum != null && request.cachedChecksum === checksum) {
				return {
					statusCode: request.http2 ? constants.HTTP_STATUS_NOT_MODIFIED : NOT_MODIFIED,
					cacheControl: "public,max-age=31536000,immutable",
					polyfillsHeader: encodeFeatureSetForHttpHeader(featureSet)
				};
			}

			// Return an OK
			return {
				contentType: "application/javascript; charset=utf-8",
				statusCode: request.http2 ? constants.HTTP_STATUS_OK : OK,
				body: buffer,
				cacheControl: "public,max-age=31536000,immutable",
				contentEncoding: polyfillRequest.encoding,
				checksum,
				polyfillsHeader: encodeFeatureSetForHttpHeader(featureSet)
			};
		} catch (ex) {
			// Respond with error code 500
			const statusCode = request.http2 ? constants.HTTP_STATUS_INTERNAL_SERVER_ERROR : INTERNAL_SERVER_ERROR;

			return {
				contentType: "text/html; charset=utf-8",
				statusCode,
				body: generateErrorHtml(ex, statusCode)
			};
		}
	}
}
