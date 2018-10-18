import {IPolyfillBl} from "./i-polyfill-bl";
import {IPolyfillRequest} from "../../polyfill/i-polyfill-request";
import {constant} from "../../constant/constant";
import {ICacheRegistryService} from "../../service/registry/cache-registry/i-cache-registry-service";
import {getOrderedPolyfillsWithDependencies} from "../../util/polyfill/polyfill-util";
import {ILoggerService} from "../../service/logger/i-logger-service";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";
import {IPolyfillBuilderService} from "../../service/polyfill-builder/i-polyfill-builder-service";
import {IGetPolyfillsResult} from "./i-get-polyfills-result";

/**
 * Business logic for polyfills
 */
export class PolyfillBl implements IPolyfillBl {

	constructor (private readonly cacheRegistry: ICacheRegistryService,
							 private readonly logger: ILoggerService,
							 private readonly builder: IPolyfillBuilderService) {
	}

	/**
	 * Generates a chunk of polyfills that matches the given request
	 * @param {IPolyfillRequest} request
	 * @returns {Promise<IGetPolyfillsResult>}
	 */
	public async getPolyfills (request: IPolyfillRequest): Promise<IGetPolyfillsResult> {
		// Check if a polyfill set exists within the cache for the request features and the user agent of the request
		let featureSet = await this.cacheRegistry.getPolyfillFeatureSet(request.features, request.userAgent);

		// If not, resolve and order the required polyfills
		if (featureSet == null) {
			featureSet = await getOrderedPolyfillsWithDependencies(
				new Set([...request.features]
				// Take only valid names
					.filter(feature => feature.name in constant.polyfill)),
				request.userAgent
			);
			// Store them within the cache
			await this.cacheRegistry.setPolyfillFeatureSet(request.features, featureSet, request.userAgent);
		} else {
			this.logger.debug("Matched Polyfill Set in cache!");
		}

		this.logger.debug(featureSet);

		// Check if a Set has already been registered for this combination
		const existingSet = await this.cacheRegistry.get(featureSet, request.encoding);
		if (existingSet != null) {
			this.logger.debug("Matched Polyfills in cache!");
			// If it has, just return that one
			return {result: existingSet, featureSet};
		}

		// Otherwise, build the polyfills and store them in the Cache Registry before returning them
		const {brotli, minified, zlib} = await this.builder.buildPolyfillSet(featureSet);

		// Add the polyfills to the registry
		const [minifiedResult, brotliResult, zlibResult] = await Promise.all([
			this.cacheRegistry.set(featureSet, minified),
			this.cacheRegistry.set(featureSet, brotli, ContentEncodingKind.BROTLI),
			this.cacheRegistry.set(featureSet, zlib, ContentEncodingKind.GZIP)
		]);

		// Return the joined Buffer
		switch (request.encoding) {
			case ContentEncodingKind.BROTLI:
				return {result: brotliResult, featureSet};
			case ContentEncodingKind.GZIP:
				return {result: zlibResult, featureSet};
			case undefined:
				return {result: minifiedResult, featureSet};
		}
	}

}