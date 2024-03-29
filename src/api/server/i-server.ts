import type {Request} from "express";
import type {MaybeArray} from "../../common/type/type-util.js";
import type {ContentEncodingKind} from "../../encoding/content-encoding-kind.js";

export interface HttpServerOptions {
	host: string;
	port: number;
}

export interface HttpsServerOptions extends HttpServerOptions {
	https: boolean;
	key: Buffer;
	cert: Buffer;
}

export type ServerOptions = HttpServerOptions | HttpsServerOptions;

export interface ApiRequest {
	request: Request;
	url: URL;
	userAgent: string | undefined;
	cachedChecksum: string | undefined;
	acceptEncoding: Set<ContentEncodingKind> | undefined;
}

export interface ApiResponse<T = unknown> {
	statusCode: number;
	headers?: Record<string, string>;
	body?: T;
}

export type ApiRequestHandler = (request: ApiRequest) => Promise<ApiResponse>;

export type ApiMethod = "GET" | "PUT" | "POST" | "DELETE" | "OPTIONS";
export type ContentType = "application/json" | "text/html";
export type ApiPath = string | RegExp;
export type ApiPaths = MaybeArray<ApiPath>;
export type RegisteredApiMethods<T> = {[Key in ApiMethod]?: Map<ApiPath, keyof T & string>};

export type ApiController<T = unknown> = {[Key in keyof T & string]: unknown} & {
	__apiMethods?: RegisteredApiMethods<T>;
};

export type ApiControllers = ApiController[];

export interface IServer {
	initialize(): Promise<void>;
	start(options: ServerOptions): Promise<void>;
	stop(): Promise<void>;
}
