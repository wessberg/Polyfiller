import {IStaticController} from "./i-static-controller";
import {Controller} from "../controller/controller";
import {Request} from "../../server/i-request";
import {Response} from "../../server/i-response";
import {GET} from "../../server/decorator/get";
import {constants} from "http2";
import {OK} from "http-status-codes";
import {constant} from "../../constant/constant";
import {IStaticBl} from "../../bl/static/i-static-bl";

/**
 * A controller that can respond to requests for static resources
 */
export class StaticController extends Controller implements IStaticController {

	constructor (private readonly staticBl: IStaticBl) {
		super();
	}

	/**
	 * Called when the index (/) is requested
	 * @param {Request} request
	 * @returns {Promise<Response>}
	 */
	@GET({path: constant.endpoint.index})
	public async onIndexRequested (request: Request): Promise<Response> {

		// Return an OK
		return {
			contentType: "text/html",
			statusCode: request.http2
				? constants.HTTP_STATUS_OK
				: OK,
			body: await this.staticBl.getWelcomeMessage()
		};
	}

}