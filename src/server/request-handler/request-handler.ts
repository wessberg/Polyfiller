import {IRequestHandler} from "./i-request-handler";
import {Response} from "../i-response";
import {printRequest} from "../../util/request-util/request-util";
import {RequestHandlerOptions} from "./request-handler-options";
import {constants} from "http2";
import {METHOD_NOT_ALLOWED, OK} from "http-status-codes";
import {RegisteredControllers} from "../../controller/controller/registered-controllers";
import {IStaticController} from "../../controller/static/i-static-controller";

/**
 * A handler that can handle requests
 */
export class RequestHandler implements IRequestHandler {
	constructor(private readonly controllers: RegisteredControllers, private readonly staticController: IStaticController) {}

	/**
	 * Handles the given request
	 * @param {RequestHandlerOptions} options
	 * @returns {Promise<Response>}
	 */
	public async handle(options: RequestHandlerOptions): Promise<Response> {
		// Print the request
		printRequest(options.request);

		switch (options.request.method) {
			case "GET":
				return await this.handleGetRequest(options);
			case "OPTIONS":
				return await this.handleOptionsRequest(options);
			default:
				return {
					body: `Only GET requests are supported`,
					statusCode: options.request.http2 ? constants.HTTP_STATUS_METHOD_NOT_ALLOWED : METHOD_NOT_ALLOWED,
					contentType: "text/plain"
				};
		}
	}

	/**
	 * Handles the given GET request
	 * @param {RequestHandlerOptions} options
	 * @returns {Promise<Response>}
	 */
	private async handleGetRequest(options: RequestHandlerOptions): Promise<Response> {
		// Find the first matched controller
		for (const controller of this.controllers) {
			const match = controller.match(options.request);
			if (match != null) {
				return await match(options.request);
			}
		}

		// Fall back to the index route
		return await this.staticController.onIndexRequested(options.request);
	}

	/**
	 * Handles the given OPTIONS request
	 * @param {RequestHandlerOptions} options
	 * @returns {Promise<Response>}
	 */
	private async handleOptionsRequest(options: RequestHandlerOptions): Promise<Response> {
		return {
			statusCode: options.request.http2 ? constants.HTTP_STATUS_OK : OK
		};
	}
}
