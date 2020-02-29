import {IMemoryRegistryService} from "./i-memory-registry-service";
import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {IPolyfillFeature, IPolyfillFeatureInput} from "../../../polyfill/i-polyfill-feature";
import {getCoreJsBundleIdentifier, getPolyfillIdentifier, getPolyfillSetIdentifier} from "../../../util/polyfill/polyfill-util";
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
	 * A map between keys for registered Core-js bundles and their content
	 * @type {Map<string, Buffer>}
	 */
	private readonly registeredCoreJsBundles: Map<string, Buffer> = new Map();

	/**
	 * Gets the contents for the polyfill with the given name and with the given encoding
	 *
	 * @param name
	 * @param [encoding]
	 * @returns
	 */
	async get(name: IPolyfillFeature | Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<IRegistryGetResult | undefined> {
		const checksum = getPolyfillIdentifier(name, encoding);
		const buffer = this.registeredPolyfills.get(checksum);

		return buffer == null ? undefined : {buffer, checksum};
	}

	/**
	 * Gets the Set of Polyfill feature inputs that matches the given input
	 *
	 * @param input
	 * @param userAgent
	 */
	async getPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, userAgent: string): Promise<Set<IPolyfillFeature> | undefined> {
		const checksum = getPolyfillSetIdentifier(input, userAgent);
		return this.registeredPolyfillSets.get(checksum);
	}

	/**
	 * Gets the Core-js bundle that matches the given paths, if any
	 *
	 * @param paths
	 * @returns
	 */
	async getCoreJsBundle(paths: string[]): Promise<Buffer | undefined> {
		const checksum = getCoreJsBundleIdentifier(paths);
		return this.registeredCoreJsBundles.get(checksum);
	}

	/**
	 * Returns true if a polyfill wil the given name exists
	 *
	 * @param name
	 * @param [encoding]
	 * @returns
	 */
	async has(name: IPolyfillFeature | Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<boolean> {
		return this.registeredPolyfills.has(getPolyfillIdentifier(name, encoding));
	}

	/**
	 * Returns true if a Set of PolyfillFeatures exist in cache for the given PolyfillFeature input Set
	 *
	 * @param input
	 * @param userAgent
	 * @returns
	 */
	async hasPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, userAgent: string): Promise<boolean> {
		return this.registeredPolyfillSets.has(getPolyfillSetIdentifier(input, userAgent));
	}

	/**
	 * Returns true if a bundle exists for the given Core-js paths
	 *
	 * @param paths
	 * @returns
	 */
	async hasCoreJsBundle(paths: string[]): Promise<boolean> {
		return this.registeredCoreJsBundles.has(getCoreJsBundleIdentifier(paths));
	}

	/**
	 * Sets the contents for the polyfill with the given name and of the given encoding
	 *
	 * @param name
	 * @param buffer
	 * @param [encoding]
	 * @returns
	 */
	async set(name: IPolyfillFeature | Set<IPolyfillFeature>, buffer: Buffer, encoding?: ContentEncodingKind): Promise<IRegistryGetResult> {
		const checksum = getPolyfillIdentifier(name, encoding);

		this.registeredPolyfills.set(checksum, buffer);
		return {buffer, checksum};
	}

	/**
	 * Sets the given PolyfillFeature Set for the given Set of PolyfillFeature inputs
	 *
	 * @param input
	 * @param polyfillSet
	 * @param userAgent
	 * @returns
	 */
	async setPolyfillFeatureSet(
		input: Set<IPolyfillFeatureInput>,
		polyfillSet: Set<IPolyfillFeature>,
		userAgent: string
	): Promise<Set<IPolyfillFeature>> {
		const checksum = getPolyfillSetIdentifier(input, userAgent);

		this.registeredPolyfillSets.set(checksum, polyfillSet);
		return polyfillSet;
	}

	/**
	 * Sets the given bundle Buffer for the given Core-js paths
	 *
	 * @param paths
	 * @param bundle
	 */
	async setCoreJsBundle(paths: string[], bundle: Buffer): Promise<Buffer> {
		const checksum = getCoreJsBundleIdentifier(paths);

		this.registeredCoreJsBundles.set(checksum, bundle);
		return bundle;
	}
}
