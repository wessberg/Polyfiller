import {Response} from "../i-response";
import {RequestHandlerOptions} from "./request-handler-options";

export interface IRequestHandler {
	handle (options: RequestHandlerOptions): Promise<Response>;
}