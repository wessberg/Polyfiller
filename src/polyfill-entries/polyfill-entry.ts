import {PolyfillDealiasedName, PolyfillName} from "./polyfill-name";
import {PolyfillMeta, PolyfillMetaKey} from "./polyfill-meta";
import {PolyfillContext} from "./polyfill-context";
import {MaybeArray} from "helpertypes";

export type ContextualPolyfillEntryValueWithMeta<Name extends PolyfillMetaKey> = (context: PolyfillContext, meta: Omit<PolyfillMeta[Name], "force">) => MaybeArray<string>;
export type ContextualPolyfillEntryValue = (context: PolyfillContext) => MaybeArray<string>;

export interface PolyfillEntry<Name extends PolyfillName> {
	/**
	 * The entry path(s) for this polyfill.
	 * Can be any location from the root, including node_modules
	 * Can also be a function that receives metadata and context and returns paths based on that
	 */
	entry: Name extends PolyfillMetaKey ? ContextualPolyfillEntryValueWithMeta<Name> : ContextualPolyfillEntryValue | MaybeArray<string>;

	/**
	 * All of the PolyfillNames that this entry depends on. If not given, the polyfill is assumed to have no dependencies
	 */
	dependencies?: PolyfillName[];

	/**
	 * The check to run in each associated runtime to determine whether or not the feature is supported
	 */
	check?: () => void;

	/**
	 * The contexts in which this polyfill can be applied. For example, some polyfills only support "window".
	 * If not given, it defaults to all contexts
	 */
	context?: Set<PolyfillContext>;

	/**
	 * The (semver) version of the polyfill. Is useful in combination with disk caching for deciding
	 * whether or not to invalidate the cache.
	 */
	version: MaybeArray<string>;
	/**
	 * The polyfills that must come before this one. The 'dependencies' property kind of does the same thing,
	 * but this field guarantees order
	 */
	mustComeAfter?: PolyfillName[] | "*";

	/**
	 * The Caniuse or MDN features that a given polyfill provides.
	 * Used when comparing with a user agent for support
	 * @deprecated
	 */
	features?: string[];
}

export type PolyfillEntries = {[Key in PolyfillDealiasedName]?: PolyfillEntry<Key>};
