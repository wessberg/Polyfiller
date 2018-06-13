import {IMemoryRegistryService} from "./i-memory-registry-service";
import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {IPolyfillFeature, IPolyfillFeatureInput} from "../../../polyfill/i-polyfill-feature";
import {getPolyfillIdentifier, getPolyfillSetIdentifier} from "../../../util/polyfill/polyfill-util";
import {IRegistryGetResult} from "./i-registry-get-result";

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
	 * @param {IPolyfillFeature|Set<IPolyfillFeature>} name
	 * @param {ContentEncodingKind} [encoding]
	 * @returns {Promise<IRegistryGetResult?>}
	 */
	public async get (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<IRegistryGetResult|undefined> {
		const checksum = getPolyfillIdentifier(name, encoding);
		const buffer = this.registeredPolyfills.get(checksum);

		return buffer == null ? undefined : {buffer, checksum };
	}

	/**
	 * Gets the Set of Polyfill feature inputs that matches the given input
	 * @param {Set<IPolyfillFeatureInput>} input
	 */
	public async getPolyfillFeatureSet (input: Set<IPolyfillFeatureInput>, userAgent: string): Promise<Set<IPolyfillFeature>|undefined> {
		const checksum = getPolyfillSetIdentifier(input, userAgent);
		return this.registeredPolyfillSets.get(checksum);
	}

	/**
	 * Returns true if a polyfill wil the given name exists
	 * @param {IPolyfillFeature|Set<IPolyfillFeature>} name
	 * @param {ContentEncodingKind} [encoding]
	 * @returns {Promise<boolean>}
	 */
	public async has (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<boolean> {
		return this.registeredPolyfills.has(
			getPolyfillIdentifier(name, encoding)
		);
	}

	/**
	 * Returns true if a Set of PolyfillFeatures exist in cache for the given PolyfillFeature input Set
	 * @param {Set<IPolyfillFeatureInput>} input
	 * @param {string} userAgent
	 * @returns {Promise<boolean>}
	 */
	public async hasPolyfillFeatureSet (input: Set<IPolyfillFeatureInput>, userAgent: string): Promise<boolean> {
		return this.registeredPolyfillSets.has(
			getPolyfillSetIdentifier(input, userAgent)
		);
	}

	/**
	 * Sets the contents for the polyfill with the given name and of the given encoding
	 * @param {IPolyfillFeature|Set<IPolyfillFeature>} name
	 * @param {Buffer} buffer
	 * @param {ContentEncodingKind} [encoding]
	 * @returns {Promise<IRegistryGetResult>}
	 */
	public async set (name: IPolyfillFeature|Set<IPolyfillFeature>, buffer: Buffer, encoding?: ContentEncodingKind): Promise<IRegistryGetResult> {
		const checksum = getPolyfillIdentifier(name, encoding);

		this.registeredPolyfills.set(checksum, buffer);
		return {buffer, checksum};
	}

	/**
	 * Sets the given PolyfillFeature Set for the given Set of PolyfillFeature inputs
	 * @param {Set<IPolyfillFeatureInput>} input
	 * @param {Set<IPolyfillFeature>} polyfillSet
	 * @param {string} userAgent
	 * @returns {Promise<Set<IPolyfillFeature>>}
	 */
	public async setPolyfillFeatureSet (input: Set<IPolyfillFeatureInput>, polyfillSet: Set<IPolyfillFeature>, userAgent: string): Promise<Set<IPolyfillFeature>> {
		const checksum = getPolyfillSetIdentifier(input, userAgent);

		this.registeredPolyfillSets.set(checksum, polyfillSet);
		return polyfillSet;
	}

}