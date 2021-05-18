import {IApiService} from "./i-api-service";
import {IConfig} from "../../config/i-config";
import {IServer} from "../../api/server/i-server";

/**
 * Helps with working with the API
 */
export class ApiService implements IApiService {
	constructor(private readonly server: IServer, private readonly config: IConfig) {}

	/**
	 * Launches the API.
	 *
	 * @returns
	 */
	async start(): Promise<void> {
		await this.server.initialize();
		await this.server.start(this.config);
	}
}
