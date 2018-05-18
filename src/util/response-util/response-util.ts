import {Http2ServerResponse} from "http2";
import {ServerResponse as HttpServerResponse} from "http";
import {Response} from "../../server/i-response";

// tslint:disable:no-any

/**
 * Responds to the given request with the given response
 * @param {HttpServerResponse} rawResponse
 * @param {Response} response
 * @returns {void}
 */
export function respondToRequest (rawResponse: HttpServerResponse|Http2ServerResponse, response: Response): void {
	rawResponse.setHeader("Content-Type", response.contentType);

	if ("body" in response) {
		rawResponse.setHeader("Content-Length", Buffer.byteLength(response.body));
	}

	if ("cacheControl" in response && response.cacheControl != null) {
		rawResponse.setHeader("Cache-Control", response.cacheControl);
	}

	if ("contentEncoding" in response && response.contentEncoding != null) {
		rawResponse.setHeader("Content-Encoding", response.contentEncoding);
	}

	// Allow any origin
	rawResponse.setHeader("Access-Control-Allow-Origin", "*");

	rawResponse.statusCode = response.statusCode;
	(<any>rawResponse).end("body" in response ? response.body : undefined);
}