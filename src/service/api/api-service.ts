import {IApiService} from "./i-api-service";
import {IServer} from "../../api/server/i-server";
import {Config} from "../../config/config";

/**
 * Helps with working with the API
 */
export class ApiService implements IApiService {
	constructor(private readonly server: IServer, private readonly config: Config) {}

	/**
	 * Launches the API.
	 */
	async start(): Promise<void> {
		await this.server.initialize();
		await this.server.start(this.config);
	}
}
