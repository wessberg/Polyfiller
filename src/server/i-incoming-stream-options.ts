import {IncomingHttpHeaders, ServerHttp2Stream} from "http2";
import {IRequestHandler} from "./request-handler/i-request-handler";
import {IServeOptions} from "./i-serve-options";

export interface IIncomingStreamOptions {
	stream: ServerHttp2Stream;
	headers: IncomingHttpHeaders;
	serverOptions: IServeOptions;
	handler: IRequestHandler;
}