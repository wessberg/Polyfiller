import {Method} from "./method";
import {ContentEncodingKind} from "../encoding/content-encoding-kind";

export interface IRawRequest {
	http2: boolean;
	tls: boolean;
	method?: Method;
	userAgent?: string;
	acceptEncoding?: Set<ContentEncodingKind>;
	host: string;
	port: number;
	path: string;
}

export interface IRequest {
	http2: boolean;
	method: Method;
	url: URL;
	userAgent: string;
	accept?: Set<string>;
	acceptEncoding?: Set<string>;
	acceptLanguage?: Set<string>;
	cachedChecksum?: string;
}

export interface IGetRequest extends IRequest {
	method: "GET";
}

export interface IPutRequest extends IRequest {
	method: "PUT";
}

export interface IPostRequest extends IRequest {
	method: "POST";
}

export interface IDeleteRequest extends IRequest {
	method: "DELETE";
}

export interface IOptionsRequest extends IRequest {
	method: "OPTIONS";
}

export declare type Request = IGetRequest | IPutRequest | IPostRequest | IDeleteRequest | IOptionsRequest;
