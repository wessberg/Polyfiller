import {IPolyfillBl} from "./i-polyfill-bl";
import {IPolyfillRequest} from "../../polyfill/i-polyfill-request";
import {constant} from "../../constant/constant";
import {Buffer} from "buffer";
import {IPolyfillFeatureInput} from "../../polyfill/i-polyfill-feature";
import {ICacheRegistryService} from "../../service/registry/cache-registry/i-cache-registry-service";
import {PolyfillName} from "../../polyfill/polyfill-name";
import {getOrderedPolyfillsWithDependencies} from "../../util/polyfill/polyfill-util";
import {ILoggerService} from "../../service/logger/i-logger-service";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";
import {ICompressorService} from "../../service/compression/i-compressor-service";
import {IRegistryGetResult} from "../../service/registry/polyfill-registry/i-registry-get-result";
import {config} from "../../config/config";

/**
 * Business logic for polyfills
 */
export class PolyfillBl implements IPolyfillBl {

	constructor (private readonly cacheRegistry: ICacheRegistryService,
							 private readonly logger: ILoggerService,
							 private readonly compressor: ICompressorService) {
	}

	/**
	 * Generates a chunk of polyfills that matches the given request
	 * @param {IPolyfillRequest} request
	 * @returns {Promise<IRegistryGetResult>}
	 */
	public async getPolyfills (request: IPolyfillRequest): Promise<IRegistryGetResult> {
		const polyfillSet: Set<IPolyfillFeatureInput> = getOrderedPolyfillsWithDependencies(
			new Set([...request.features]
			// Take only valid names
				.filter(feature => feature.name in constant.polyfill)),
			request.userAgent
		);

		console.log(config.debug);
		this.logger.debug(polyfillSet);

		// Check if a Set has already been registered for this combination
		const existingSet = await this.cacheRegistry.get(polyfillSet, request.encoding);
		if (existingSet != null) {
			// If it has, just return that one
			return existingSet;
		}
		// Otherwise, take all un-encoded buffers from the registry
		const results = <IRegistryGetResult[]> (await Promise.all([...polyfillSet]
				.map(async polyfill => {
					let result = await this.cacheRegistry.get(polyfill);

					if (result == null && polyfill.name === "intl" && polyfill.meta.locale != null) {
						// This may be due to this specific combination of locales with Intl not having been cached yet
						// Instead, request raw Intl, concatenate locale buffers, and then write to cache
						result = await this.cacheRegistry.get({name: polyfill.name, meta: {}});
						if (result == null) throw new Error("Intl was undefined!");

						const locales: PolyfillName[]|PolyfillName = polyfill.meta.locale;

						// Add the locales to the Buffer
						const normalizedLocales = typeof locales === "string" ? [locales] : locales;
						const localeResults = <IRegistryGetResult[]> (await Promise.all(normalizedLocales.map(async locale => await this.cacheRegistry.get({name: locale, meta: {}}))))
							.filter(localeBuffer => localeBuffer != null);

						// Concatenate the Intl buffer with the selected locales
						result.buffer = Buffer.concat([result.buffer, ...localeResults.map(localeBuffer => localeBuffer.buffer)]);

						// Store it within the cache
						await this.cacheRegistry.set(polyfill, result.buffer);

						// Return the result
						return result;
					}
					if (result == null) {
						this.logger.log(`No polyfill was found for: ${JSON.stringify(polyfill, null, " ")}`);
					}
					return result;
				}))
		)
			.filter(polyfill => polyfill != null);

		// Concatenate them
		const concated = Buffer.concat(results.map(result => result.buffer));

		// Compress it with Brotli and Zlib
		const compressed = await this.compressor.compress(concated);

		// Add the polyfills to the registry
		const [concatenatedResult, brotliResult, zlibResult] = await Promise.all([
			this.cacheRegistry.set(polyfillSet, concated),
			this.cacheRegistry.set(polyfillSet, compressed.brotli, ContentEncodingKind.BROTLI),
			this.cacheRegistry.set(polyfillSet, compressed.zlib, ContentEncodingKind.GZIP)
		]);

		// Return the joined Buffer
		switch (request.encoding) {
			case ContentEncodingKind.BROTLI:
				return brotliResult;
			case ContentEncodingKind.GZIP:
				return zlibResult;
			case undefined:
				return concatenatedResult;
		}
	}

}