import type {PolyfillFeatureInput} from "./polyfill-feature.js";

/**
 * The name for the force argument within raw queries, immediately following the polyfill divider
 * @type {string}
 */
export const polyfillRawForceName: keyof PolyfillFeatureInput = "force";
