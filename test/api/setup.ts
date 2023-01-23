import {container} from "../../src/services.js";
import type {IApiService} from "../../src/service/api/i-api-service.js";
import type {ICacheRegistryService} from "../../src/service/registry/cache-registry/i-cache-registry-service.js";

const apiService = container.get<IApiService>();
const cacheRegistry = container.get<ICacheRegistryService>();

/**
 * Sets up the test environment
 */
export async function initializeTests(): Promise<void> {
	await cacheRegistry.initialize();
	await apiService.start();
}
