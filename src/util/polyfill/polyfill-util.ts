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
import {truncate} from "@wessberg/stringutil";
import {IPolyfillLibraryDictEntry, IPolyfillLocalDictEntry} from "../../polyfill/polyfill-dict";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import toposort from "toposort";
import {POLYFILL_CONTEXTS, PolyfillContext} from "../../polyfill/polyfill-context";
import {PolyfillCachingContext} from "../../service/registry/polyfill-registry/i-memory-registry-service";

/**
 * Traces all polyfill names that matches the given name. It may be an alias, and it may refer to additional aliases
 * within the given features
 *
 * @param name
 * @returns
 */
export function traceAllPolyfillNamesForPolyfillName(name: PolyfillName): Set<PolyfillDealiasedName> {
	// Get the PolyfillDict that matches the given name
	const match = constant.polyfill[name];
	// If none exists, return an empty array
	if (match == null) return new Set();

	// If the PolyfillDict is not an alias, return the name of the polyfill itself
	if (!("polyfills" in match)) return new Set([name as PolyfillDealiasedName]);

	// Otherwise, recursively trace all polyfill names for each of the polyfill names
	return new Set(
		([] as PolyfillDealiasedName[]).concat.apply(
			[],
			match.polyfills.map(polyfillName => [...traceAllPolyfillNamesForPolyfillName(polyfillName)])
		)
	);
}

/**
 * Returns a stringified key as a function of the given polyfill name(s) and encoding
 */
export function getPolyfillIdentifier(
	name: IPolyfillFeature | IPolyfillFeatureInput | Set<IPolyfillFeature> | Set<IPolyfillFeatureInput>,
	context: PolyfillCachingContext
): string {
	const shasum = createHash("sha1");
	const normalizedName = name instanceof Set ? name : new Set([name]);
	const sortedName = [...normalizedName].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
	const namePart = sortedName.map(part => `${part.name}${JSON.stringify(part.meta)}${context}`).join(",");
	shasum.update(`[${namePart}].${context.sourcemap}.${context.minify}.${context.encoding || "none"}`);
	return shasum.digest("hex");
}

/**
 * Returns a stringified key as a function of the given Set of polyfill feature inputs
 */
export function getPolyfillSetIdentifier(polyfills: Set<IPolyfillFeatureInput>, context: PolyfillCachingContext): string {
	const shasum = createHash("sha1");
	const sortedName = [...polyfills].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
	const namePart = sortedName.map(part => `${part.name}${JSON.stringify(part.meta)}${JSON.stringify(part.force)}${JSON.stringify(context)}`).join(",");
	shasum.update(`[${namePart}].${context.userAgent}.${context.context}`);
	return shasum.digest("hex");
}

/**
 * Returns true if the given polyfill should be included for a particular user agent
 */
function shouldIncludePolyfill(force: boolean, context: PolyfillContext, userAgent: string, features: string[], supportedContexts: Set<PolyfillContext>): boolean {
	return supportedContexts.has(context) && (force || features.length < 1 || !userAgentSupportsFeatures(userAgent, ...features));
}

/**
 * Gets the dependors of the given Polyfill name, including those that it must follow if they are - optionally - included
 *
 * @param polyfillName
 * @param includedPolyfillNames
 * @returns
 */
function getEffectiveDependors(polyfillName: PolyfillDealiasedName, includedPolyfillNames: Set<PolyfillDealiasedName>): PolyfillDealiasedName[] {
	const allOtherPolyfillNames = [...includedPolyfillNames].filter(name => name !== polyfillName);
	const allOtherPolyfills = allOtherPolyfillNames.map(name => [name, constant.polyfill[name]] as [PolyfillDealiasedName, IPolyfillLocalDictEntry | IPolyfillLibraryDictEntry]);
	return allOtherPolyfills
		.filter(([, dict]) => {
			const dependsOnPolyfill = dict.dependencies.some(dependency => traceAllPolyfillNamesForPolyfillName(dependency).has(polyfillName));
			const mustComeAfterThisPolyfill =
				dict.mustComeAfter != null && (dict.mustComeAfter === "*" || dict.mustComeAfter.some(dependency => traceAllPolyfillNamesForPolyfillName(dependency).has(polyfillName)));
			return dependsOnPolyfill || mustComeAfterThisPolyfill;
		})
		.map(([name]) => name);
}

/**
 * Gets all those polyfills that are required for a user agent
 */
function getRequiredPolyfillsForUserAgent(
	polyfillSet: Set<IPolyfillFeatureInput>,
	userAgent: string,
	context: PolyfillContext
): [IPolyfillFeature[], Map<PolyfillDealiasedName, number>] {
	const polyfills: IPolyfillFeature[] = [];
	const polyfillNames: Set<PolyfillDealiasedName> = new Set();
	const polyfillNameToPolyfillIndexMap: Map<PolyfillDealiasedName, number> = new Map();
	let currentIndex = 0;

	polyfillSet.forEach(polyfill => {
		const match = constant.polyfill[polyfill.name];

		if (shouldIncludePolyfill(polyfill.force, context, userAgent, match.features, match.contexts)) {
			const existingIndex = polyfillNameToPolyfillIndexMap.get(polyfill.name);
			if (existingIndex != null) {
				polyfills[existingIndex].meta = polyfill.meta;
			} else {
				polyfills.push({name: polyfill.name, meta: polyfill.meta});
				polyfillNameToPolyfillIndexMap.set(polyfill.name, currentIndex++);
				polyfillNames.add(polyfill.name);
			}

			const resolvedDependencies: PolyfillDealiasedName[] = ([] as PolyfillDealiasedName[]).concat.apply(
				[],
				match.dependencies.map(dependency => [...traceAllPolyfillNamesForPolyfillName(dependency)])
			);
			for (const childPolyfill of getRequiredPolyfillsForUserAgent(
				new Set(resolvedDependencies.map(dependency => ({name: dependency, meta: {}, force: polyfill.force}))),
				userAgent,
				context
			)[0]) {
				if (!polyfillNames.has(childPolyfill.name)) {
					polyfills.push({
						...childPolyfill,
						meta: {
							...childPolyfill.meta,
							...polyfill.meta
						}
					});
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
 */
export async function getOrderedPolyfillsWithDependencies(polyfillSet: Set<IPolyfillFeatureInput>, userAgent: string, context: PolyfillContext): Promise<Set<IPolyfillFeature>> {
	const [requiredPolyfills, polyfillToIndexMap] = getRequiredPolyfillsForUserAgent(polyfillSet, userAgent, context);
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
 *
 * @param url
 * @param userAgent
 * @param [encoding]
 * @returns
 */
export function getPolyfillRequestFromUrl(url: URL, userAgent: string, encoding?: ContentEncodingKind): IPolyfillRequest {
	const featuresRaw = url.searchParams.get("features");
	const contextRaw = url.searchParams.get("context") as PolyfillContext;
	const sourcemapRaw = url.searchParams.get("sourcemap");
	const minifyRaw = url.searchParams.get("minify");
	const sourcemap = sourcemapRaw === "" || (sourcemapRaw != null && booleanize(sourcemapRaw));
	const minify = minifyRaw === "" || (minifyRaw != null && booleanize(minifyRaw));
	const context: PolyfillContext = contextRaw == null || !POLYFILL_CONTEXTS.includes(contextRaw) ? "window" : contextRaw;

	// Prepare a Set of features
	const featureSet: Set<IPolyfillFeatureInput> = new Set();

	// If any features are given, walk through them and add to the features set
	if (featuresRaw != null) {
		// Split the comma-separated polyfills
		const splitted = featuresRaw.split(polyfillRawSeparator);

		for (const part of splitted) {
			let force = false;
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
					meta[key] = splittedValue.length === 0 ? true : splittedValue.length === 1 ? splittedValue[0] : splittedValue;
				}
			}

			// Trace all polyfill names referenced by the identifier for this polyfill and add all of them to the feature set
			for (const polyfillName of traceAllPolyfillNamesForPolyfillName(name as PolyfillName)) {
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
		features: featureSet,
		context,
		sourcemap,
		minify
	};
}

/**
 * Encodes a PolyfillSet such that it can be embedded in a HTTP header
 *
 * @param polyfillSet
 * @returns
 */
export function encodeFeatureSetForHttpHeader(polyfillSet: Set<IPolyfillFeature>): string {
	return truncate(
		[...polyfillSet]
			.map(({meta, name}) => {
				let str = name;
				if (meta != null) {
					const metaEntries = Object.entries(meta);
					if (metaEntries.length > 0) {
						str += " (";
						str += metaEntries.map(([key, value]) => `${key}: ${value}`).join(", ");
						str += `)`;
					}
				}
				return str;
			})
			.join(", "),
		{length: constant.header.maxChars, omission: "...[omitted]"}
	);
}
