import "../../src/services";
import {DIContainer} from "@wessberg/di";
// @ts-ignore
import {chrome} from "useragent-generator";
import {IApiService} from "../../src/service/api/i-api-service";
import {ICacheRegistryService} from "../../src/service/registry/cache-registry/i-cache-registry-service";

// tslint:disable:no-any
const apiService = DIContainer.get<IApiService>();
const cacheRegistry = DIContainer.get<ICacheRegistryService>();

/**
 * Sets up the test environment
 * @returns {Promise<void>}
 */
export async function initializeTests (): Promise<void> {
	await cacheRegistry.initialize();
	await apiService.launch();
}