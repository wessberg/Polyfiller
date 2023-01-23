import type {IPolyfillBl} from "./i-polyfill-bl.js";
import type {PolyfillRequest} from "../../polyfill/polyfill-request.js";
import {constant} from "../../constant/constant.js";
import type {ICacheRegistryService} from "../../service/registry/cache-registry/i-cache-registry-service.js";
import {getOrderedPolyfillsWithDependencies} from "../../util/polyfill/polyfill-util.js";
import type {ILoggerService} from "../../service/logger/i-logger-service.js";
import type {IPolyfillBuilderService} from "../../service/polyfill-builder/i-polyfill-builder-service.js";
import type {PolyfillResponse} from "../../polyfill/polyfill-response.js";

/**
 * Business logic for polyfills
 */
export class PolyfillBl implements IPolyfillBl {
	constructor(private readonly cacheRegistry: ICacheRegistryService, private readonly logger: ILoggerService, private readonly builder: IPolyfillBuilderService) {}

	/**
	 * Generates a chunk of polyfills that matches the given request
	 */
	async getPolyfills(request: PolyfillRequest): Promise<PolyfillResponse> {
		// Check if a polyfill set exists within the cache for the request features and the user agent of the request
		let featureSet = await this.cacheRegistry.getPolyfillFeatureSet(request.features, request);

		// If not, resolve and order the required polyfills
		if (featureSet == null) {
			featureSet = await getOrderedPolyfillsWithDependencies(
				new Set(
					[...request.features]
						// Take only valid names
						.filter(feature => feature.name in constant.polyfill)
				),
				request.userAgent,
				request.context
			);

			// Store them within the cache
			await this.cacheRegistry.setPolyfillFeatureSet(request.features, featureSet, request);
		} else {
			this.logger.debug("Matched Polyfill Set in cache!");
		}

		this.logger.debug(featureSet);

		// Check if a Set has already been registered for this combination
		const existingSet = await this.cacheRegistry.get(featureSet, request);
		if (existingSet != null) {
			this.logger.debug("Matched Polyfills in cache!");
			// If it has, just return that one
			return {...existingSet, featureSet};
		}

		// Otherwise, build the polyfills and store them in the Cache Registry before returning them
		const {brotli, minified, zlib} = await this.builder.buildPolyfillSet(featureSet, request);

		// Add the polyfills to the registry
		const [minifiedResult, brotliResult, zlibResult] = await Promise.all([
			this.cacheRegistry.set(featureSet, minified, {...request, encoding: undefined}),
			this.cacheRegistry.set(featureSet, brotli, {...request, encoding: "br"}),
			this.cacheRegistry.set(featureSet, zlib, {...request, encoding: "gzip"})
		]);

		// Return the joined Buffer
		switch (request.encoding) {
			case "br":
				return {...brotliResult, featureSet};
			case "gzip":
				return {...zlibResult, featureSet};
			case undefined:
				return {...minifiedResult, featureSet};
		}
	}
}
