import "./services";
import {DIContainer} from "@wessberg/di";
import {IApiService} from "./service/api/i-api-service";
import {ICacheRegistryService} from "./service/registry/cache-registry/i-cache-registry-service";

// Initializes the Cache Registry and then launches the server
DIContainer.get<ICacheRegistryService>().initialize()
	.then(async () => DIContainer.get<IApiService>().launch());

// Exports
export {PolyfillName} from "./polyfill/polyfill-name";
export {polyfillRawForceName} from "./polyfill/polyfill-raw-force-name";
export {polyfillOptionValueSeparator} from "./polyfill/polyfill-option-value-separator";
export {polyfillRawDivider} from "./polyfill/polyfill-raw-divider";
export {polyfillRawSeparator} from "./polyfill/polyfill-raw-separator";