import "./services";
import {DIContainer} from "@wessberg/di";
import {IApiService} from "./service/api/i-api-service";

// Launches the API
// noinspection JSIgnoredPromiseFromCall
DIContainer.get<IApiService>().launch();

// Exports
export {PolyfillName} from "./polyfill/polyfill-name";
export {polyfillRawForceName} from "./polyfill/polyfill-raw-force-name";
export {polyfillOptionValueSeparator} from "./polyfill/polyfill-option-value-separator";
export {polyfillRawDivider} from "./polyfill/polyfill-raw-divider";
export {polyfillRawSeparator} from "./polyfill/polyfill-raw-separator";