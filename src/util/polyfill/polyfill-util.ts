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
import * as URLNamespace from "url";
const {URL} = URLNamespace;

const marshaller = new Marshaller();

/**
 * Generates an IPolyfillRequest from the given URL
 * @param {URL} url
 * @param {string} userAgent
 * @param {ContentEncodingKind} [encoding]
 * @returns {IPolyfillRequest}
 */
export function getPolyfillRequestFromUrl (url: URL, userAgent: string, encoding?: ContentEncodingKind): IPolyfillRequest {
	// Replace all literal "+" with its literal encoded variant
	url.search = url.search.replace(/\+/g, "%2B");
	// Replace the URL reference with a new instance with the encoded '+' sign
	url = new URL(url.toString());

	const featuresRaw = url.searchParams.get("features");
	let force: boolean = false;

	// Prepare a Set of features
	const featureSet: Set<IPolyfillFeatureInput> = new Set();

	// If any features are given, walk through them and add to the features set
	if (featuresRaw != null) {
		// Split the comma-separated polyfills
		const splitted = featuresRaw.split(polyfillRawSeparator);

		for (const part of splitted) {
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

			// Add it to the set of polyfillable features
			featureSet.add({
				name: <PolyfillName>name,
				force,
				meta
			});
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
 * @param {IPolyfillFeature | Set<IPolyfillFeature>} name
 * @param {ContentEncodingKind} [encoding]
 * @returns {string}
 */
export function getPolyfillIdentifier (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): string {
	const shasum = createHash("sha1");
	const normalizedName = name instanceof Set ? name : new Set([name]);
	const sortedName = [...normalizedName].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	const namePart = sortedName.map(part => `${part.name}${JSON.stringify(part.meta)}`).join(",");
	shasum.update(`[${namePart}].${encoding == null ? "" : encoding}`);
	return shasum.digest("hex");
}

/**
 * Orders the polyfills given in the Set, including their dependencies
 * @param {Set<IPolyfillFeature>} polyfillSet
 * @param {string} userAgent
 * @returns {Set<IPolyfillFeature>}
 */
export function getOrderedPolyfillsWithDependencies (polyfillSet: Set<IPolyfillFeatureInput>, userAgent: string): Set<IPolyfillFeatureInput> {
	const orderedPolyfillSet: Set<IPolyfillFeatureInput> = new Set();
	const has = (polyfill: IPolyfillFeature) => [...orderedPolyfillSet].some(existingOrderedPolyfill => {

		// Don't allow adding subsets of broader polyfill collections that are already included
		if (polyfill.name.startsWith("es2015.") && existingOrderedPolyfill.name === "es2015") return true;
		if (polyfill.name.startsWith("es2016+.") && existingOrderedPolyfill.name === "es2016+") return true;
		if (polyfill.name.startsWith("es2015.date.") && existingOrderedPolyfill.name === "es2015.date") return true;
		if (polyfill.name.startsWith("es2015.object.") && existingOrderedPolyfill.name === "es2015.object") return true;
		if (polyfill.name.startsWith("es2015.array.") && existingOrderedPolyfill.name === "es2015.array") return true;
		if (polyfill.name.startsWith("es2016+.object.") && existingOrderedPolyfill.name === "es2016+.object") return true;
		if (polyfill.name.startsWith("es2016+.array.") && existingOrderedPolyfill.name === "es2016+.array") return true;

		return existingOrderedPolyfill.name === polyfill.name;
	});

	polyfillSet.forEach(polyfill => {
		const {dependencies, caniuseFeatures} = constant.polyfill[polyfill.name];
		dependencies.forEach(dependency => {
			getOrderedPolyfillsWithDependencies(new Set([{name: dependency, meta: {}, force: false}]), userAgent)
				.forEach(orderedPolyfill => {
					// Only add the polyfill if it isn't included already
					if (!has(orderedPolyfill)) {
						orderedPolyfillSet.add(orderedPolyfill);
					}
				});
		});
		// Only add the polyfill if it isn't included already and if the user agent doesn't already support the feature
		if (!has(polyfill) && (polyfill.force || caniuseFeatures.length < 1 || (caniuseFeatures.some(caniuseFeature => !userAgentSupportsFeatures(userAgent, caniuseFeature))))) {
			orderedPolyfillSet.add(polyfill);
		}
	});

	return orderedPolyfillSet;
}