import {constant} from "../../constant/constant";
import {GET} from "../decorator/api-method/get";
import {ApiRequest, ApiResponse} from "../server/i-server";
import {encodeFeatureSetForHttpHeader, getPolyfillRequestFromUrl} from "../../util/polyfill/polyfill-util";
import {StatusCodes} from "http-status-codes";
import {IPolyfillBl} from "../../bl/polyfill/i-polyfill-bl";
import {pickEncoding} from "../util/util";

export class PolyfillApiController {
	constructor(private polyfillBl: IPolyfillBl) {}

	@GET({path: constant.endpoint.polyfill})
	async onPolyfillRequested(request: ApiRequest): Promise<ApiResponse> {
		// Normalize the polyfill request
		const polyfillRequest = getPolyfillRequestFromUrl(request.url, request.userAgent, pickEncoding(request.acceptEncoding));

		// Generate polyfill bundle
		const {buffer, checksum, featureSet} = await this.polyfillBl.getPolyfills(polyfillRequest);

		// If the cached checksum (ETag) is identical, respond with NOT_MODIFIED
		if (request.cachedChecksum != null && request.cachedChecksum === checksum) {
			return {
				statusCode: StatusCodes.NOT_MODIFIED,
				headers: {
					"Cache-Control": constant.header.cache.immutable,
					[constant.header.polyfills]: encodeFeatureSetForHttpHeader(featureSet)
				}
			};
		}

		// Return an OK
		return {
			statusCode: StatusCodes.OK,
			body: buffer,
			headers: {
				"Content-Type": "application/javascript; charset=utf-8",
				"Cache-Control": constant.header.cache.immutable,
				...(polyfillRequest.encoding == null
					? {}
					: {
							"Content-Encoding": polyfillRequest.encoding
					  }),
				ETag: checksum,
				[constant.header.polyfills]: encodeFeatureSetForHttpHeader(featureSet)
			}
		};
	}
}
