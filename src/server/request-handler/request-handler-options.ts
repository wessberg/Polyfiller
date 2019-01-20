import {IDeleteRequest, IGetRequest, IOptionsRequest, IPostRequest, IPutRequest, Request} from "../i-request";
import {IServeOptions} from "../i-serve-options";

export interface IRequestHandlerOptions {
	request: Request;
	serverOptions: IServeOptions;
}

export interface IGetRequestHandlerOptions extends IRequestHandlerOptions {
	request: IGetRequest;
}

export interface IPutRequestHandlerOptions extends IRequestHandlerOptions {
	request: IPutRequest;
}

export interface IPostRequestHandlerOptions extends IRequestHandlerOptions {
	request: IPostRequest;
}

export interface IDeleteRequestHandlerOptions extends IRequestHandlerOptions {
	request: IDeleteRequest;
}

export interface IOptionsRequestHandlerOptions extends IRequestHandlerOptions {
	request: IOptionsRequest;
}

export declare type RequestHandlerOptions = IGetRequestHandlerOptions | IPutRequestHandlerOptions | IPostRequestHandlerOptions | IDeleteRequestHandlerOptions | IOptionsRequestHandlerOptions;
