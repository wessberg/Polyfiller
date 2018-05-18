/**
 * Caniuse doesn't report that much from ES2015 (instead it relies on http://kangax.github.io/compat-table/es6).
 * There are some features, however, that are supported
 * @type {string[]}
 */
export const ES2015_CANIUSE_FEATURE_NAMES = ["es6-class", "promises"];

/**
 * Caniuse doesn't report that much from ES2016+ (instead it relies on http://kangax.github.io/compat-table).
 * There are some features, however, that are supported
 * @type {string[]}
 */
export const ES2016_PLUS_CANIUSE_FEATURE_NAMES = ["object-values"];

/**
 * Caniuse doesn't contain any information as to which browser support iterable DOM collections.
 * Instead, assume that all browsers without support for ES2015 doesn't support DOM iterables either
 * @type {string[]}
 */
export const DOM_ITERABLE_CANIUSE_FEATURE_NAMES = ES2015_CANIUSE_FEATURE_NAMES;