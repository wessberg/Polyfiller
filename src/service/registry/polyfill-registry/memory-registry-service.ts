import type {IMemoryRegistryService, PolyfillCachingContext} from "./i-memory-registry-service.js";
import type {PolyfillFeature, PolyfillFeatureInput} from "../../../polyfill/polyfill-feature.js";
import {getPolyfillIdentifier, getPolyfillSetIdentifier} from "../../../util/polyfill/polyfill-util.js";
import type {IRegistryGetResult} from "./i-registry-get-result.js";

/**
 * A Registry of polyfills living in-memory
 */
export class MemoryRegistryService implements IMemoryRegistryService {
	/**
	 * A map between keys for registered polyfills and their content
	 * @type {Map<string, Buffer>}
	 */
	private readonly registeredPolyfills: Map<string, Buffer> = new Map();

	/**
	 * A map between keys for registered polyfill sets and and their actual sets
	 * @type {Map<string, Set<PolyfillFeature>>}
	 */
	private readonly registeredPolyfillSets: Map<string, Set<PolyfillFeature>> = new Map();

	/**
	 * Gets the contents for the polyfill with the given name and with the given encoding
	 */
	async get(name: PolyfillFeature | Set<PolyfillFeature>, context: PolyfillCachingContext): Promise<IRegistryGetResult | undefined> {
		const checksum = getPolyfillIdentifier(name, context);
		const buffer = this.registeredPolyfills.get(checksum);

		return buffer == null ? undefined : {buffer, checksum};
	}

	/**
	 * Gets the Set of Polyfill feature inputs that matches the given input
	 */
	async getPolyfillFeatureSet(input: Set<PolyfillFeatureInput>, context: PolyfillCachingContext): Promise<Set<PolyfillFeature> | undefined> {
		const checksum = getPolyfillSetIdentifier(input, context);
		return this.registeredPolyfillSets.get(checksum);
	}

	/**
	 * Returns true if a polyfill wil the given name exists
	 */
	async has(name: PolyfillFeature | Set<PolyfillFeature>, context: PolyfillCachingContext): Promise<boolean> {
		return this.registeredPolyfills.has(getPolyfillIdentifier(name, context));
	}

	/**
	 * Returns true if a Set of PolyfillFeatures exist in cache for the given PolyfillFeature input Set
	 */
	async hasPolyfillFeatureSet(input: Set<PolyfillFeatureInput>, context: PolyfillCachingContext): Promise<boolean> {
		return this.registeredPolyfillSets.has(getPolyfillSetIdentifier(input, context));
	}

	/**
	 * Sets the contents for the polyfill with the given name and of the given encoding
	 */
	async set(name: PolyfillFeature | Set<PolyfillFeature>, buffer: Buffer, context: PolyfillCachingContext): Promise<IRegistryGetResult> {
		const checksum = getPolyfillIdentifier(name, context);

		this.registeredPolyfills.set(checksum, buffer);
		return {buffer, checksum};
	}

	/**
	 * Sets the given PolyfillFeature Set for the given Set of PolyfillFeature inputs
	 */
	async setPolyfillFeatureSet(input: Set<PolyfillFeatureInput>, polyfillSet: Set<PolyfillFeature>, context: PolyfillCachingContext): Promise<Set<PolyfillFeature>> {
		const checksum = getPolyfillSetIdentifier(input, context);

		this.registeredPolyfillSets.set(checksum, polyfillSet);
		return polyfillSet;
	}
}
