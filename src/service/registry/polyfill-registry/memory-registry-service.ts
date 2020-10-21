import {IMemoryRegistryService} from "./i-memory-registry-service";
import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {IPolyfillFeature, IPolyfillFeatureInput} from "../../../polyfill/i-polyfill-feature";
import {getPolyfillIdentifier, getPolyfillSetIdentifier} from "../../../util/polyfill/polyfill-util";
import {IRegistryGetResult} from "./i-registry-get-result";
import {PolyfillContext} from "../../../polyfill/polyfill-context";

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
	 * @type {Map<string, Set<IPolyfillFeature>>}
	 */
	private readonly registeredPolyfillSets: Map<string, Set<IPolyfillFeature>> = new Map();

	/**
	 * Gets the contents for the polyfill with the given name and with the given encoding
	 */
	async get(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillContext, encoding?: ContentEncodingKind): Promise<IRegistryGetResult | undefined> {
		const checksum = getPolyfillIdentifier(name, context, encoding);
		const buffer = this.registeredPolyfills.get(checksum);

		return buffer == null ? undefined : {buffer, checksum};
	}

	/**
	 * Gets the Set of Polyfill feature inputs that matches the given input
	 */
	async getPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, userAgent: string, context: PolyfillContext): Promise<Set<IPolyfillFeature> | undefined> {
		const checksum = getPolyfillSetIdentifier(input, userAgent, context);
		return this.registeredPolyfillSets.get(checksum);
	}

	/**
	 * Returns true if a polyfill wil the given name exists
	 */
	async has(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillContext, encoding?: ContentEncodingKind): Promise<boolean> {
		return this.registeredPolyfills.has(getPolyfillIdentifier(name, context, encoding));
	}

	/**
	 * Returns true if a Set of PolyfillFeatures exist in cache for the given PolyfillFeature input Set
	 */
	async hasPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, userAgent: string, context: PolyfillContext): Promise<boolean> {
		return this.registeredPolyfillSets.has(getPolyfillSetIdentifier(input, userAgent, context));
	}

	/**
	 * Sets the contents for the polyfill with the given name and of the given encoding
	 */
	async set(name: IPolyfillFeature | Set<IPolyfillFeature>, buffer: Buffer, context: PolyfillContext, encoding?: ContentEncodingKind): Promise<IRegistryGetResult> {
		const checksum = getPolyfillIdentifier(name, context, encoding);

		this.registeredPolyfills.set(checksum, buffer);
		return {buffer, checksum};
	}

	/**
	 * Sets the given PolyfillFeature Set for the given Set of PolyfillFeature inputs
	 */
	async setPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, polyfillSet: Set<IPolyfillFeature>, userAgent: string, context: PolyfillContext): Promise<Set<IPolyfillFeature>> {
		const checksum = getPolyfillSetIdentifier(input, userAgent, context);

		this.registeredPolyfillSets.set(checksum, polyfillSet);
		return polyfillSet;
	}
}
