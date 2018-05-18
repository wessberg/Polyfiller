import "../../src/services";
import {DIContainer} from "@wessberg/di";
// @ts-ignore
import {chrome} from "useragent-generator";
import {IApiService} from "../../src/service/api/i-api-service";

// tslint:disable:no-any

const apiService = DIContainer.get<IApiService>();

/**
 * Sets up the test environment
 * @returns {Promise<void>}
 */
export async function setupTests (): Promise<void> {
	await apiService.launch();
}