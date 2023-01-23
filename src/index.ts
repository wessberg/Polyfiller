import {container} from "./services.js";
import type {IApiService} from "./service/api/i-api-service.js";
import type {ICacheRegistryService} from "./service/registry/cache-registry/i-cache-registry-service.js";

// Initializes the Cache Registry and then launches the server
container
	.get<ICacheRegistryService>()
	.initialize()
	.then(async () => container.get<IApiService>().start());

// Exports
export {PolyfillName} from "./polyfill/polyfill-name.js";
export {polyfillRawForceName} from "./polyfill/polyfill-raw-force-name.js";
export {polyfillOptionValueSeparator} from "./polyfill/polyfill-option-value-separator.js";
export {polyfillRawDivider} from "./polyfill/polyfill-raw-divider.js";
export {polyfillRawSeparator} from "./polyfill/polyfill-raw-separator.js";
