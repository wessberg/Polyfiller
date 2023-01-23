/* eslint-disable @typescript-eslint/naming-convention */
import {constant} from "../../constant/constant.js";
import {GET} from "../decorator/api-method/get.js";
import type {ApiRequest, ApiResponse} from "../server/i-server.js";
import {encodeFeatureSetForHttpHeader, getPolyfillRequestFromUrl} from "../../util/polyfill/polyfill-util.js";
import {StatusCodes} from "http-status-codes";
import type {IPolyfillBl} from "../../bl/polyfill/i-polyfill-bl.js";
import {pickEncoding} from "../util/util.js";
import type {IMetricsService} from "../../service/metrics/i-metrics-service.js";
import {generateBrowserslistFromUseragent} from "browserslist-generator";

export class PolyfillApiController {
	constructor(private readonly polyfillBl: IPolyfillBl, private readonly metricsService: IMetricsService) {}

	@GET({path: constant.endpoint.polyfill})
	async onPolyfillRequested(request: ApiRequest): Promise<ApiResponse> {
		// Attempt to parse the user agent into a proper Browserslist
		if (request.userAgent != null) {
			try {
				generateBrowserslistFromUseragent(request.userAgent);
			} catch (ex: unknown) {
				// Un-set the user agent
				request.userAgent = undefined;
				// Capture the exception, but allow it
				this.metricsService.captureException(ex as Error);
			}
		}

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
				"Content-Type": "application/javascript",
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
