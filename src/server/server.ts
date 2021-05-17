import {IServer} from "./i-server";
import {createSecureServer, createServer, Http2SecureServer, Http2Server, Http2ServerRequest, Http2ServerResponse} from "http2";
import {createServer as createHttpServer, IncomingMessage as HttpIncomingMessage, ServerResponse as HttpServerResponse, Server as HttpServer} from "http";
import {createServer as createHttpsServer, Server as HttpSecureServer} from "https";
import {IRequestHandler} from "./request-handler/i-request-handler";
import {getRequestFromIncomingHeaders} from "../util/request-util/request-util";
import {respondToRequest} from "../util/response-util/response-util";
import {IServeOptions} from "./i-serve-options";
import {ILoggerService} from "../service/logger/i-logger-service";
import {IRequestHandlerOptions, RequestHandlerOptions} from "./request-handler/request-handler-options";
import {OnInitializedCallback} from "./on-initialized-callback";

/**
 * A HTTP2 Server
 */
export class Server implements IServer {
	/**
	 * Whether or not a server is currently being initialized
	 * @type {boolean}
	 */
	initializing = false;

	/**
	 * Whether or not the server has initialized
	 * @type {boolean}
	 */
	hasInitialized = false;

	/**
	 * The constructed Server
	 * @type {Http2SecureServer|Http2Server|null}
	 */
	private server: Http2SecureServer | Http2Server | HttpServer | HttpSecureServer | null = null;

	/**
	 * All callbacks that will be invoked when the server has initialized
	 * @type {Set<OnInitializedCallback>}
	 */
	private readonly onInitializedCallbacks: Set<OnInitializedCallback> = new Set();

	constructor(private readonly logger: ILoggerService, private readonly requestHandler: IRequestHandler) {}

	/**
	 * Starts a new HTTP2 server and listens on the given port
	 *
	 * @param options
	 * @returns
	 */
	async serve(options: IServeOptions): Promise<void> {
		if (this.initializing || this.hasInitialized) return;

		if (this.server != null) await this.stop();
		this.initializing = true;
		this.hasInitialized = false;

		// Only run a TLS-encrypted server if a key and cert is given
		const shouldRunSecureServer = options.key != null && options.cert != null;
		const http2RequestHandler = async (request: HttpIncomingMessage | Http2ServerRequest, response: HttpServerResponse | Http2ServerResponse, tls: boolean) =>
			this.onRequest(request, response, options, tls);

		if (options.http2) {
			// Create HTTP2 server
			this.server = shouldRunSecureServer
				? createSecureServer({key: options.key, cert: options.cert, allowHTTP1: true}, async (request, response) => http2RequestHandler(request, response, true))
				: createServer({}, async (request, response) => http2RequestHandler(request, response, false));
		} else {
			// Create HTTP server
			this.server = shouldRunSecureServer
				? createHttpsServer({key: options.key, cert: options.cert}, async (request, response) => http2RequestHandler(request, response, true))
				: createHttpServer(async (request, response) => http2RequestHandler(request, response, false));
		}

		// Start listening on the given port
		await new Promise<void>(resolve =>
			this.server!.listen(
				{
					port: options.port,
					path: options.root
				},
				() => {
					const startMessage = options.http2 ? `${shouldRunSecureServer ? "Secure " : ""}HTTP2 ` : `${shouldRunSecureServer ? "HTTPS " : "HTTP "}`;

					const endMessage = `Server is listening on ${options.host}:${options.port}`;
					this.logger.log(`${startMessage}${endMessage}`);
					this.initializing = false;
					this.hasInitialized = true;
					this.onInitializedCallbacks.forEach(callback => callback());
					this.onInitializedCallbacks.clear();
					resolve();
				}
			)
		);
	}

	/**
	 * Stops the active server, if any
	 *
	 * @returns
	 */
	async stop(): Promise<void> {
		return new Promise<void>(resolve => {
			this.hasInitialized = false;

			// If there is not server to stop, do nothing
			if (this.server == null) return resolve();

			this.server.close(() => {
				resolve();
			});
			this.server = null;
		});
	}

	/**
	 * Adds a callback to the Set of callbacks to invoke when polyfills has been successfully built
	 *
	 * @returns
	 */
	async onInitialized(): Promise<void> {
		return new Promise<void>(resolve => {
			if (!this.initializing && this.hasInitialized) return resolve();
			else this.onInitializedCallbacks.add(resolve);
		});
	}

	/**
	 * Listens for "stream" events on the given Http2SecureServer
	 *
	 * @param request
	 * @param response
	 * @param serverOptions
	 * @param tls
	 * @returns
	 */
	private async onRequest(
		request: HttpIncomingMessage | Http2ServerRequest,
		response: HttpServerResponse | Http2ServerResponse,
		serverOptions: IServeOptions,
		tls: boolean
	): Promise<void> {
		const isHttp2 = "stream" in request;

		// Format a request
		const normalizedRequest = getRequestFromIncomingHeaders(
			{
				...request.headers,
				":referer": ":referer" in request.headers ? request.headers[":referer"] : request.headers.referer,
				":method": ":method" in request.headers ? request.headers[":method"] : request.method,
				":path": ":path" in request.headers ? request.headers[":path"] : request.url,
				":scheme": ":scheme" in request.headers ? request.headers[":scheme"] : tls ? "https" : "http",
				":authority": ":authority" in request.headers ? request.headers[":authority"] : request.headers.host
			},
			isHttp2
		);

		const handleOptions: IRequestHandlerOptions = {
			request: normalizedRequest,
			serverOptions
		};

		// Respond with the result of calling the handler
		respondToRequest(response, await this.requestHandler.handle(handleOptions as RequestHandlerOptions));
	}
}
