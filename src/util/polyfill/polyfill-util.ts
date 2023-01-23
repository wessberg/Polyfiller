import type {PolyfillRequest} from "../../polyfill/polyfill-request.js";
import {polyfillRawSeparator} from "../../polyfill/polyfill-raw-separator.js";
import type {PolyfillFeature, PolyfillFeatureInput, PolyfillFeatureMeta} from "../../polyfill/polyfill-feature.js";
import type {PolyfillDealiasedName, PolyfillName} from "../../polyfill/polyfill-name.js";
import type {ContentEncodingKind} from "../../encoding/content-encoding-kind.js";
import {polyfillRawDivider} from "../../polyfill/polyfill-raw-divider.js";
import {polyfillOptionKeyValueDivider} from "../../polyfill/polyfill-option-key-value-divider.js";
import {polyfillRawForceName} from "../../polyfill/polyfill-raw-force-name.js";
import {polyfillOptionValueSeparator} from "../../polyfill/polyfill-option-value-separator.js";
import {createHash} from "crypto";
import {constant} from "../../constant/constant.js";
import {generateBrowserslistFromUseragent, browsersWithSupportForEcmaVersion, getAppropriateEcmaVersionForBrowserslist, userAgentSupportsFeatures} from "browserslist-generator";
import {truncate} from "@wessberg/stringutil";
import type {IPolyfillLibraryDictEntry, IPolyfillLocalDictEntry} from "../../polyfill/polyfill-dict.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import toposort from "toposort";
import type {PolyfillContext} from "../../polyfill/polyfill-context.js";
import {POLYFILL_CONTEXTS} from "../../polyfill/polyfill-context.js";
import type {PolyfillCachingContext} from "../../service/registry/polyfill-registry/i-memory-registry-service.js";
import {booleanize} from "../../api/util.js";

/**
 * Traces all polyfill names that matches the given name. It may be an alias, and it may refer to additional aliases
 * within the given features
 */
function traceAllPolyfillNamesForPolyfillName(name: PolyfillName): Set<PolyfillDealiasedName> {
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
export function getPolyfillIdentifier(name: PolyfillFeature | PolyfillFeatureInput | Set<PolyfillFeature> | Set<PolyfillFeatureInput>, context: PolyfillCachingContext): string {
	const shasum = createHash("sha1");
	const normalizedName = name instanceof Set ? name : new Set([name]);
	const sortedName = [...normalizedName].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
	const namePart = sortedName.map(part => `{name:${part.name},meta:${JSON.stringify(part.meta)}}`).join(",");

	shasum.update(
		`features:[${namePart}],sourcemap:${context.sourcemap},minify:${context.minify},ecmaversion:${context.ecmaVersion},module:${context.module},context:${
			context.context
		},encoding:${context.encoding || "none"}`
	);
	return shasum.digest("hex");
}

/**
 * Returns a checksum for the polyfill configuration file
 */
export function getPolyfillConfigChecksum(): string {
	const shasum = createHash("sha1");

	return shasum.update(JSON.stringify({...constant.polyfill, cacheVersion: constant.cacheVersion})).digest("hex");
}

/**
 * Returns a stringified key as a function of the given Set of polyfill feature inputs
 */
export function getPolyfillSetIdentifier(polyfills: Set<PolyfillFeatureInput>, context: PolyfillCachingContext): string {
	const shasum = createHash("sha1");
	const sortedName = [...polyfills].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
	const namePart = sortedName.map(part => `{name:${part.name},meta:${JSON.stringify(part.meta)},force:${JSON.stringify(part.force)}}`).join(",");

	shasum.update(`features:[${namePart}],useragent:${context.userAgent},context:${context.context}`);

	return shasum.digest("hex");
}

/**
 * Returns true if the given polyfill should be included for a particular user agent
 */
function shouldIncludePolyfill(force: boolean, context: PolyfillContext, userAgent: string | undefined, features: string[], supportedContexts: Set<PolyfillContext>): boolean {
	return supportedContexts.has(context) && (force || features.length < 1 || (userAgent != null && !userAgentSupportsFeatures(userAgent, ...features)));
}

/**
 * Gets the dependors of the given Polyfill name, including those that it must follow if they are - optionally - included
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
	polyfillSet: Set<PolyfillFeatureInput>,
	userAgent: string | undefined,
	context: PolyfillContext
): [PolyfillFeature[], Map<PolyfillDealiasedName, number>] {
	const polyfills: PolyfillFeature[] = [];
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
export async function getOrderedPolyfillsWithDependencies(
	polyfillSet: Set<PolyfillFeatureInput>,
	userAgent: string | undefined,
	context: PolyfillContext
): Promise<Set<PolyfillFeature>> {
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
 */
export function getPolyfillRequestFromUrl(url: URL, userAgent: string | undefined, encoding?: ContentEncodingKind): PolyfillRequest {
	const featuresRaw = url.searchParams.get("features");
	const contextRaw = url.searchParams.get("context") as PolyfillContext;
	const sourcemapRaw = url.searchParams.get("sourcemap");
	const minifyRaw = url.searchParams.get("minify");
	const moduleRaw = url.searchParams.get("module");
	const sourcemap = sourcemapRaw === "" || (sourcemapRaw != null && booleanize(sourcemapRaw));
	const minify = minifyRaw === "" || (minifyRaw != null && booleanize(minifyRaw));
	const module = moduleRaw === "" || (moduleRaw != null && booleanize(moduleRaw));
	const context: PolyfillContext = contextRaw == null || !POLYFILL_CONTEXTS.includes(contextRaw) ? "window" : contextRaw;

	// Prepare a Set of features
	const featureSet: Set<PolyfillFeatureInput> = new Set();

	// If any features are given, walk through them and add to the features set
	if (featuresRaw != null) {
		// Split the comma-separated polyfills
		const splitted = featuresRaw.split(polyfillRawSeparator);

		for (const part of splitted) {
			let force = false;
			const meta: PolyfillFeatureMeta = {};

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
	const browserslist = userAgent == null ? browsersWithSupportForEcmaVersion("es5") : generateBrowserslistFromUseragent(userAgent);
	return {
		userAgent,
		browserslist,
		ecmaVersion: getAppropriateEcmaVersionForBrowserslist(browserslist),
		encoding,
		features: featureSet,
		context,
		sourcemap,
		minify,
		module
	};
}

/**
 * Encodes a PolyfillSet such that it can be embedded in a HTTP header
 */
export function encodeFeatureSetForHttpHeader(polyfillSet: Set<PolyfillFeature>): string {
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
