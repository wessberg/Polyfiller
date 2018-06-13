import {IPolyfillBl} from "./i-polyfill-bl";
import {IPolyfillRequest} from "../../polyfill/i-polyfill-request";
import {constant} from "../../constant/constant";
import {ICacheRegistryService} from "../../service/registry/cache-registry/i-cache-registry-service";
import {getOrderedPolyfillsWithDependencies} from "../../util/polyfill/polyfill-util";
import {ILoggerService} from "../../service/logger/i-logger-service";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";
import {IRegistryGetResult} from "../../service/registry/polyfill-registry/i-registry-get-result";
import {IPolyfillBuilderService} from "../../service/polyfill-builder/i-polyfill-builder-service";

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
	 * @returns {Promise<IRegistryGetResult>}
	 */
	public async getPolyfills (request: IPolyfillRequest): Promise<IRegistryGetResult> {
		// Check if a polyfill set exists within the cache for the request features and the user agent of the request
		let polyfillSet = await this.cacheRegistry.getPolyfillFeatureSet(request.features, request.userAgent);

		// If not, resolve and order the required polyfills
		if (polyfillSet == null) {
			polyfillSet = await getOrderedPolyfillsWithDependencies(
				new Set([...request.features]
				// Take only valid names
					.filter(feature => feature.name in constant.polyfill)),
				request.userAgent
			);
			// Store them within the cache
			await this.cacheRegistry.setPolyfillFeatureSet(request.features, polyfillSet, request.userAgent);
		}

		else {
			this.logger.debug("Matched Polyfill Set in cache!");
		}

		this.logger.debug(polyfillSet);

		// Check if a Set has already been registered for this combination
		const existingSet = await this.cacheRegistry.get(polyfillSet, request.encoding);
		if (existingSet != null) {
			this.logger.debug("Matched Polyfills in cache!");
			// If it has, just return that one
			return existingSet;
		}

		// Otherwise, build the polyfills and store them in the Cache Registry before returning them
		const {brotli, minified, zlib} = await this.builder.buildPolyfillSet(polyfillSet);

		// Add the polyfills to the registry
		const [minifiedResult, brotliResult, zlibResult] = await Promise.all([
			this.cacheRegistry.set(polyfillSet, minified),
			this.cacheRegistry.set(polyfillSet, brotli, ContentEncodingKind.BROTLI),
			this.cacheRegistry.set(polyfillSet, zlib, ContentEncodingKind.GZIP)
		]);

		// Return the joined Buffer
		switch (request.encoding) {
			case ContentEncodingKind.BROTLI:
				return brotliResult;
			case ContentEncodingKind.GZIP:
				return zlibResult;
			case undefined:
				return minifiedResult;
		}
	}

}