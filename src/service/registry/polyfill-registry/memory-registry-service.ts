import {IMemoryRegistryService} from "./i-memory-registry-service";
import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {IPolyfillFeature} from "../../../polyfill/i-polyfill-feature";
import {getPolyfillIdentifier} from "../../../util/polyfill/polyfill-util";

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
	 * Gets the contents for the polyfill with the given name and with the given encoding
	 * @param {IPolyfillFeature|Set<IPolyfillFeature>} name
	 * @param {ContentEncodingKind} [encoding]
	 * @returns {Promise<Buffer?>}
	 */
	public async get (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<Buffer|undefined> {

		return this.registeredPolyfills.get(
			getPolyfillIdentifier(name, encoding)
		);
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
	 * Sets the contents for the polyfill with the given name and of the given encoding
	 * @param {IPolyfillFeature|Set<IPolyfillFeature>} name
	 * @param {Buffer} contents
	 * @param {ContentEncodingKind} [encoding]
	 * @returns {Promise<void>}
	 */
	public async set (name: IPolyfillFeature|Set<IPolyfillFeature>, contents: Buffer, encoding?: ContentEncodingKind): Promise<void> {
		this.registeredPolyfills.set(
			getPolyfillIdentifier(name, encoding),
			contents
		);
	}

}