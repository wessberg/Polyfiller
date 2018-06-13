import {IPolyfillRequest} from "../../polyfill/i-polyfill-request";
import {booleanize} from "../booleanize/booleanize";
import {polyfillRawSeparator} from "../../polyfill/polyfill-raw-separator";
import {IPolyfillFeature, IPolyfillFeatureInput, IPolyfillFeatureMeta} from "../../polyfill/i-polyfill-feature";
import {PolyfillName} from "../../polyfill/polyfill-name";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";
import {polyfillRawDivider} from "../../polyfill/polyfill-raw-divider";
import {polyfillOptionKeyValueDivider} from "../../polyfill/polyfill-option-key-value-divider";
import {polyfillRawForceName} from "../../polyfill/polyfill-raw-force-name";
import {polyfillOptionValueSeparator} from "../../polyfill/polyfill-option-value-separator";
import {Marshaller} from "@wessberg/marshaller";
import {createHash} from "crypto";
import {constant} from "../../constant/constant";
import {userAgentSupportsFeatures} from "@wessberg/browserslist-generator";

const marshaller = new Marshaller();

/**
 * Traces all polyfill names that matches the given name. It may be an alias, and it may refer to additional aliases
 * within the given features
 * @param {PolyfillName} name
 * @returns {PolyfillName[]}
 */
export function traceAllPolyfillNamesForPolyfillName (name: PolyfillName): PolyfillName[] {
	// Get the PolyfillDict that matches the given name
	const match = constant.polyfill[name];
	// If none exists, return an empty array
	if (match == null) return [];

	// If the PolyfillDict is not an alias, return the name of the polyfill itself
	if (!("polyfills" in match)) return [name];

	// Otherwise, recursively trace all polyfill names for each of the polyfill names
	return [].concat.apply([], match.polyfills.map(polyfillName => traceAllPolyfillNamesForPolyfillName(polyfillName)));
}

/**
 * Generates an IPolyfillRequest from the given URL
 * @param {URL} url
 * @param {string} userAgent
 * @param {ContentEncodingKind} [encoding]
 * @returns {IPolyfillRequest}
 */
export function getPolyfillRequestFromUrl (url: URL, userAgent: string, encoding?: ContentEncodingKind): IPolyfillRequest {

	const featuresRaw = url.searchParams.get("features");

	// Prepare a Set of features
	const featureSet: Set<IPolyfillFeatureInput> = new Set();

	// If any features are given, walk through them and add to the features set
	if (featuresRaw != null) {
		// Split the comma-separated polyfills
		const splitted = featuresRaw.split(polyfillRawSeparator);

		for (const part of splitted) {
			let force: boolean = false;
			const meta: IPolyfillFeatureMeta = {};

			// The first part will be the polyfill name
			const [name, ...rest] = part.split(polyfillRawDivider);

			// Walk through the rest of the options
			for (const option of rest) {
				const [key, value] = option.split(polyfillOptionKeyValueDivider);

				const splittedValue = value == null ? [] : value.split(polyfillOptionValueSeparator);

				// If the key is 'force', treat it separately
				if (key === polyfillRawForceName) {
					force = splittedValue.length === 0 || splittedValue.every(booleanize);
				}

				// Otherwise, treat it as meta data
				else {
					meta[key] = splittedValue.length === 0
						? true
						: splittedValue.length === 1
							? marshaller.unmarshal(splittedValue[0])
							: splittedValue.map(splittedValuePart => marshaller.unmarshal(splittedValuePart));
				}
			}

			// Trace all polyfill names referenced by the identifier for this polyfill and add all of them to the feature set
			for (const polyfillName of traceAllPolyfillNamesForPolyfillName(<PolyfillName> name)) {
				// Add it to the set of polyfillable features
				featureSet.add({
					name: polyfillName,
					force,
					meta
				});
			}
		}
	}

	// Return the IPolyfillRequest
	return {
		userAgent,
		encoding,
		features: featureSet
	};
}

/**
 * Returns a stringified key as a function of the given polyfill name(s) and encoding
 * @param {IPolyfillFeature | IPolyfillFeatureInput | Set<IPolyfillFeature> | Set<IPolyfillFeatureInput>} name
 * @param {ContentEncodingKind} [encoding]
 * @returns {string}
 */
export function getPolyfillIdentifier (name: IPolyfillFeature|IPolyfillFeatureInput|Set<IPolyfillFeature>|Set<IPolyfillFeatureInput>, encoding?: string): string {
	const shasum = createHash("sha1");
	const normalizedName = name instanceof Set ? name : new Set([name]);
	const sortedName = [...normalizedName].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	const namePart = sortedName.map(part => `${part.name}${JSON.stringify(part.meta)}`).join(",");
	shasum.update(`[${namePart}].${encoding == null ? "" : encoding}`);
	return shasum.digest("hex");
}

/**
 * Returns a stringified key as a function of the given Set of polyfill feature inputs
 * @param {Set<IPolyfillFeatureInput>} polyfills
 * @param {string} userAgent
 * @returns {string}
 */
export function getPolyfillSetIdentifier (polyfills: Set<IPolyfillFeatureInput>, userAgent: string): string {
	const shasum = createHash("sha1");
	const sortedName = [...polyfills].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	const namePart = sortedName.map(part => `${part.name}${JSON.stringify(part.meta)}${JSON.stringify(part.force)}`).join(",");
	shasum.update(`[${namePart}].${userAgent}`);
	return shasum.digest("hex");
}

/**
 * Returns a stringified key as a function of the given array of paths to Core-js files
 * @param {string[]} paths
 * @returns {string}
 */
export function getCoreJsBundleIdentifier (paths: string[]): string {
	const shasum = createHash("sha1");
	shasum.update(`[${paths.sort().join(",")}].corejs`);
	return shasum.digest("hex");
}

/**
 * Orders the polyfills given in the Set, including their dependencies
 * @param {Set<IPolyfillFeature>} polyfillSet
 * @param {string} userAgent
 * @returns {Set<IPolyfillFeature>}
 */
export async function getOrderedPolyfillsWithDependencies (polyfillSet: Set<IPolyfillFeatureInput>, userAgent: string): Promise<Set<IPolyfillFeature>> {
	let zoneMatch: IPolyfillFeatureInput|null = null;

	/**
	 * The inner recursive step of the function
	 * @param polyfill
	 */
	async function recursiveStep (polyfill: IPolyfillFeatureInput): Promise<IPolyfillFeatureInput[]> {
		const orderedPolyfills: IPolyfillFeatureInput[] = [];
		const isZone = polyfill.name === "zone";

		// Store a reference to the matched Zone polyfill
		if (isZone) zoneMatch = polyfill;

		const match = constant.polyfill[polyfill.name];

		// Skip aliases. There should be none by this point
		if ("polyfills" in match) return [];

		const {dependencies, features} = match;
		await Promise.all(dependencies.map(async dependency => {
			const tracedDependencies = traceAllPolyfillNamesForPolyfillName(dependency);
			await Promise.all(tracedDependencies.map(async tracedDependency => {
				orderedPolyfills.push(...(await recursiveStep({name: tracedDependency, meta: {}, force: polyfill.force})));
			}));
		}));

		// Only add the polyfill if it isn't included already and if the user agent doesn't already support the feature
		if (!isZone && (polyfill.force || features.length < 1 || !userAgentSupportsFeatures(userAgent, ...features))) {
			orderedPolyfills.push(polyfill);
		}
		return orderedPolyfills;
	}

	// Perform the recursive step
	const result = await Promise.all([...polyfillSet].map(recursiveStep));

	const orderedPolyfillSet: Set<IPolyfillFeatureInput> = new Set();
	const seenPolyfillNames: Set<PolyfillName> = new Set();
	const has = (polyfill: IPolyfillFeature) => seenPolyfillNames.has(polyfill.name);

	for (const nestedArray of result) {
		for (const polyfill of nestedArray) {
			if (!has(polyfill)) {
				orderedPolyfillSet.add(polyfill);
				seenPolyfillNames.add(polyfill.name);
			}
		}
	}

	// Make sure to apply zone as the last polyfill - if it was matched
	if (zoneMatch != null) orderedPolyfillSet.add(zoneMatch);
	return orderedPolyfillSet;
}