import {Request} from "../../server/i-request";
import {Response} from "../../server/i-response";

export declare type ControllerMethod = (request: Request) => Promise<Response>;