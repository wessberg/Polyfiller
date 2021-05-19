/**
 * A controller that can respond to requests for static resources
 */
import {IStaticBl} from "../../bl/static/i-static-bl";
import {GET} from "../decorator/api-method/get";
import {ApiRequest, ApiResponse} from "../server/i-server";
import {StatusCodes} from "http-status-codes";
import {OPTIONS} from "../decorator/api-method/options";
import {pickAccept} from "../util/util";

export class StaticApiController {
	constructor(private readonly staticBl: IStaticBl) {}

	@OPTIONS({path: "*"})
	async onOptionsRequested(): Promise<ApiResponse> {
		return {
			statusCode: 200
		};
	}

	/**
	 * Called when the index (/) is requested
	 */
	@GET({path: "*"})
	async onIndexRequested({request}: ApiRequest): Promise<ApiResponse> {
		const contentType = pickAccept(request.header("accept"));

		return {
			statusCode: StatusCodes.OK,
			body: await this.staticBl.getWelcomeMessage(contentType),
			headers: {
				"Content-Type": contentType
			}
		};
	}
}
