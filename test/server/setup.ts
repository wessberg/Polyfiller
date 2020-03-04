import {container} from "../../src/services";
// @ts-ignore
import {chrome} from "useragent-generator";
import {IApiService} from "../../src/service/api/i-api-service";
import {ICacheRegistryService} from "../../src/service/registry/cache-registry/i-cache-registry-service";

const apiService = container.get<IApiService>();
const cacheRegistry = container.get<ICacheRegistryService>();

/**
 * Sets up the test environment
 * @returns {Promise<void>}
 */
export async function initializeTests(): Promise<void> {
	await cacheRegistry.initialize();
	await apiService.launch();
}
