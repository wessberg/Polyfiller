import {IMemoryRegistryService} from "./i-memory-registry-service";
import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {IPolyfillFeature} from "../../../polyfill/i-polyfill-feature";
import {getPolyfillIdentifier} from "../../../util/polyfill/polyfill-util";
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
	 * @param {Buffer} buffer
	 * @param {ContentEncodingKind} [encoding]
	 * @returns {Promise<IRegistryGetResult>}
	 */
	public async set (name: IPolyfillFeature|Set<IPolyfillFeature>, buffer: Buffer, encoding?: ContentEncodingKind): Promise<IRegistryGetResult> {
		const checksum = getPolyfillIdentifier(name, encoding);

		this.registeredPolyfills.set(checksum, buffer);
		return {buffer, checksum};
	}

}