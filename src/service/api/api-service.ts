import type {IApiService} from "./i-api-service.js";
import type {IServer} from "../../api/server/i-server.js";
import type {Config} from "../../config/config.js";

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
