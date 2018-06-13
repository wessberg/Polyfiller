import {IApiService} from "./i-api-service";
import {IConfig} from "../../config/i-config";
import {IServer} from "../../server/i-server";
import {getCertificates} from "../../util/cert/cert-util";

/**
 * Helps with working with the API
 */
export class ApiService implements IApiService {

	constructor (private readonly server: IServer,
							 private readonly config: IConfig) {
	}

	/**
	 * Launches the API.
	 * @returns {Promise<void>}
	 */
	public async launch (): Promise<void> {

		// Serve if necessary
		if (this.server.initializing || this.server.hasInitialized) {
			await this.server.onInitialized();
		}
		else {
			await this.server.serve({
				http2: this.config.http2,
				host: this.config.host,
				port: this.config.port,
				root: process.cwd(),
				...await getCertificates(this.config)
			});
		}
	}

}