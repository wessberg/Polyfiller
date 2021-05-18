/**
 * A controller that can respond to requests for static resources
 */
import {IStaticBl} from "../../bl/static/i-static-bl";
import {GET} from "../decorator/api-method/get";
import {constant} from "../../constant/constant";
import {ApiResponse} from "../server/i-server";
import {StatusCodes} from "http-status-codes";
import {OPTIONS} from "../decorator/api-method/options";

export class StaticApiController {
	constructor(private readonly staticBl: IStaticBl) {}

	@OPTIONS({path: /.*/})
	async onOptionsRequested(): Promise<ApiResponse> {
		return {
			statusCode: 200
		};
	}

	/**
	 * Called when the index (/) is requested
	 */
	@GET({path: constant.endpoint.index})
	async onIndexRequested(): Promise<ApiResponse> {
		// Return an OK
		return {
			headers: {
				"Content-Type": "text/html"
			},
			statusCode: StatusCodes.OK,
			body: await this.staticBl.getWelcomeMessage()
		};
	}
}
