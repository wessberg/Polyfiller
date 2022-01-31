import {container} from "../../src/services";
import {IApiService} from "../../src/service/api/i-api-service";
import {ICacheRegistryService} from "../../src/service/registry/cache-registry/i-cache-registry-service";

const apiService = container.get<IApiService>();
const cacheRegistry = container.get<ICacheRegistryService>();

/**
 * Sets up the test environment
 */
export async function initializeTests(): Promise<void> {
	await cacheRegistry.initialize();
	await apiService.start();
}
