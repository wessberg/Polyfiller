import {IPolyfillRequest} from "../../polyfill/i-polyfill-request";
import {booleanize} from "../booleanize/booleanize";
import {polyfillRawSeparator} from "../../polyfill/polyfill-raw-separator";
import {IPolyfillFeature, IPolyfillFeatureInput, IPolyfillFeatureMeta} from "../../polyfill/i-polyfill-feature";
import {PolyfillDealiasedName, PolyfillName} from "../../polyfill/polyfill-name";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";
import {polyfillRawDivider} from "../../polyfill/polyfill-raw-divider";
import {polyfillOptionKeyValueDivider} from "../../polyfill/polyfill-option-key-value-divider";
import {polyfillRawForceName} from "../../polyfill/polyfill-raw-force-name";
import {polyfillOptionValueSeparator} from "../../polyfill/polyfill-option-value-separator";
import {createHash} from "crypto";
import {constant} from "../../constant/constant";
import {userAgentSupportsFeatures} from "@wessberg/browserslist-generator";
// @ts-ignore
import toposort from "toposort";
import {IPolyfillLibraryDictEntry, IPolyfillLocalDictEntry} from "../../polyfill/polyfill-dict";

/**
 * Traces all polyfill names that matches the given name. It may be an alias, and it may refer to additional aliases
 * within the given features
 * @param {PolyfillName} name
 * @returns {Set<PolyfillDealiasedName>}
 */
export function traceAllPolyfillNamesForPolyfillName (name: PolyfillName): Set<PolyfillDealiasedName> {
	// Get the PolyfillDict that matches the given name
	const match = constant.polyfill[name];
	// If none exists, return an empty array
	if (match == null) return new Set();

	// If the PolyfillDict is not an alias, return the name of the polyfill itself
	if (!("polyfills" in match)) return new Set([<PolyfillDealiasedName> name]);

	// Otherwise, recursively trace all polyfill names for each of the polyfill names
	return new Set([].concat.apply([], match.polyfills.map(polyfillName => [...traceAllPolyfillNamesForPolyfillName(polyfillName)])));
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
 * Returns true if the given polyfill should be included for a particular user agent
 * @param {boolean} force
 * @param {string} userAgent
 * @param {string[]} features
 */
function shouldIncludePolyfill (force: boolean, userAgent: string, features: string[]): boolean {
	return force || features.length < 1 || !userAgentSupportsFeatures(userAgent, ...features);
}

/**
 * Gets the dependors of the given Polyfill name, including those that it must follow if they are - optionally - included
 * @param {PolyfillDealiasedName} polyfillName
 * @param {Set<PolyfillDealiasedName>} includedPolyfillNames
 * @returns {PolyfillDealiasedName[]}
 */
function getEffectiveDependors (polyfillName: PolyfillDealiasedName, includedPolyfillNames: Set<PolyfillDealiasedName>): PolyfillDealiasedName[] {
	const allOtherPolyfillNames = [...includedPolyfillNames].filter(name => name !== polyfillName);
	const allOtherPolyfills: [PolyfillDealiasedName, IPolyfillLocalDictEntry|IPolyfillLibraryDictEntry][] = allOtherPolyfillNames.map(name => <[PolyfillDealiasedName, IPolyfillLocalDictEntry|IPolyfillLibraryDictEntry]> [name, constant.polyfill[name]]);
	return allOtherPolyfills
		.filter(([, dict]) => {
			const dependsOnPolyfill = dict.dependencies.some(dependency => traceAllPolyfillNamesForPolyfillName(dependency).has(polyfillName));
			const mustComeAfterThisPolyfill = dict.mustComeAfter != null && (dict.mustComeAfter === "*" || dict.mustComeAfter.some(dependency => traceAllPolyfillNamesForPolyfillName(dependency).has(polyfillName)));
			return dependsOnPolyfill || mustComeAfterThisPolyfill;
		})
		.map(([name]) => name);
}

/**
 * Gets all those polyfills that are required for a user agent
 * @param {Set<IPolyfillFeatureInput>} polyfillSet
 * @param {string} userAgent
 * @returns {[IPolyfillFeature[], Map<PolyfillDealiasedName, number>]}
 */
function getRequiredPolyfillsForUserAgent (polyfillSet: Set<IPolyfillFeatureInput>, userAgent: string): [IPolyfillFeature[], Map<PolyfillDealiasedName, number>] {
	const polyfills: IPolyfillFeature[] = [];
	const polyfillNames: Set<PolyfillDealiasedName> = new Set();
	const polyfillNameToPolyfillIndexMap: Map<PolyfillDealiasedName, number> = new Map();
	let currentIndex: number = 0;

	polyfillSet.forEach(polyfill => {
		const match = constant.polyfill[polyfill.name];

		if (shouldIncludePolyfill(polyfill.force, userAgent, match.features)) {
			const existingIndex = polyfillNameToPolyfillIndexMap.get(polyfill.name);
			if (existingIndex != null) {
				polyfills[existingIndex].meta = polyfill.meta;
			}

			else {
				polyfills.push({name: polyfill.name, meta: polyfill.meta});
				polyfillNameToPolyfillIndexMap.set(polyfill.name, currentIndex++);
				polyfillNames.add(polyfill.name);
			}

			const resolvedDependencies: PolyfillDealiasedName[] = [].concat.apply([], match.dependencies.map(dependency => [...traceAllPolyfillNamesForPolyfillName(dependency)]));
			for (const childPolyfill of getRequiredPolyfillsForUserAgent(new Set(resolvedDependencies.map(dependency => ({name: dependency, meta: {}, force: polyfill.force}))), userAgent)[0]) {
				if (!polyfillNames.has(childPolyfill.name)) {
					polyfills.push(childPolyfill);
					polyfillNameToPolyfillIndexMap.set(childPolyfill.name, currentIndex++);
					polyfillNames.add(childPolyfill.name);
				}
			}
		}
	});
	return [polyfills, polyfillNameToPolyfillIndexMap];
}

/**
 * Orders the polyfills given in the Set, including their dependencies
 * @param {Set<IPolyfillFeature>} polyfillSet
 * @param {string} userAgent
 * @returns {Set<IPolyfillFeature>}
 */
export async function getOrderedPolyfillsWithDependencies (polyfillSet: Set<IPolyfillFeatureInput>, userAgent: string): Promise<Set<IPolyfillFeature>> {
	const [requiredPolyfills, polyfillToIndexMap] = getRequiredPolyfillsForUserAgent(polyfillSet, userAgent);
	const requiredPolyfillNames: Set<PolyfillDealiasedName> = new Set(polyfillToIndexMap.keys());
	const requiredPolyfillNamesArray = [...requiredPolyfillNames];

	const graph: [PolyfillDealiasedName, PolyfillDealiasedName][] = [];
	requiredPolyfillNames.forEach(requiredPolyfillName => {
		const dependors = getEffectiveDependors(requiredPolyfillName, requiredPolyfillNames);
		dependors.forEach(dependor => graph.push([requiredPolyfillName, dependor]));
	});

	// Perform topological sorting in a directed acyclic graph
	const result: PolyfillDealiasedName[] = toposort.array(requiredPolyfillNamesArray, graph);

	// Generate a Set from the results
	return new Set(result.map(name => requiredPolyfills[polyfillToIndexMap.get(name)!]));
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
							? splittedValue[0]
							: splittedValue;
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