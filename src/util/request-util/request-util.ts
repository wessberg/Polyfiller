import {IncomingHttpHeaders, IncomingMessage, request as requestHttp, RequestOptions as HttpRequestOptions} from "http";
import {request as requestHttps} from "https";
import {IRawRequest, Request} from "../../server/i-request";
import {Response} from "../../server/i-response";
import chalk from "chalk";
import {connect, ClientHttp2Stream, ClientHttp2Session} from "http2";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";
import * as URLNamespace from "url";
const {URL} = URLNamespace;

// tslint:disable:no-any

const GET_COLOR = chalk.green;
const PUT_COLOR = chalk.yellow;
const DELETE_COLOR = chalk.red;
const POST_COLOR = chalk.blue;
const OPTIONS_COLOR = chalk.gray;

/**
 * Splits a header that represents a comma-separated list
 * @param {string} header
 * @returns {Set<string>}
 */
function splitStringifiedListHeader (header: string|string[]): Set<string> {
	const splitted = Array.isArray(header) ? header : header
		.split(",")
		.map(part => part.trim());

	return new Set(splitted);
}

/**
 * Gets an IRequest from the given IncomingHttpHeaders
 * @param {IncomingHttpHeaders} headers
 * @param {boolean} http2
 * @returns {Request}
 */
export function getRequestFromIncomingHeaders (headers: IncomingHttpHeaders, http2: boolean): Request {
	let path = headers[":path"];
	if (typeof path === "string") {
		// Replace all literal "+" with its literal encoded variant
		path = path.replace(/\+/g, "%2B");
	}
	return <Request> {
		http2,
		method: <Request["method"]> headers[":method"]!,
		accept: headers.accept == null
			? undefined
			: splitStringifiedListHeader(headers.accept),
		acceptEncoding: headers["accept-encoding"] == null
			? undefined
			: splitStringifiedListHeader(headers["accept-encoding"]!),
		acceptLanguage: headers["accept-language"] == null
			? undefined
			: splitStringifiedListHeader(headers["accept-language"]!),
		userAgent: <string> headers["user-agent"]!,
		// @ts-ignore
		url: new URL(path, `${headers[":scheme"]}://${headers[":authority"]}`)
	};
}

/**
 * Paints the given method with Chalk. Each method has its' own color
 * @param {string} method
 * @returns {string}
 */
function paintMethod (method: Request["method"]): string {
	switch (method) {
		case "GET":
			return GET_COLOR(method);
		case "PUT":
			return PUT_COLOR(method);
		case "POST":
			return POST_COLOR(method);
		case "DELETE":
			return DELETE_COLOR(method);
		case "OPTIONS":
			return OPTIONS_COLOR(method);
	}
}

/**
 * Prints the given request
 * @param {IRequest} request
 */
export function printRequest ({method, url}: Request): void {
	console.log(
		`${paintMethod(method)} ${url.toString()}`
	);
}

/**
 * Sends the given request and returns a Promise of the result
 * @param {IRawRequest} rawRequest
 * @returns {Promise<Response>}
 */
export async function sendRequest (rawRequest: IRawRequest): Promise<Response> {
	return new Promise<Response>(async resolve => {
		const response: Response = {
			contentType: "text/plain",
			statusCode: 0,
			body: ""
		};

		let contentType: string|undefined;
		let cacheControl: string|undefined;
		let statusCode: number|undefined;
		let contentEncoding: string|undefined;

		const setResponseHeaders = () => {
			if (statusCode != null) {
				response.statusCode = statusCode;
			}

			if (contentType != null) {
				response.contentType = contentType;
			}

			if (cacheControl != null) {
				response.cacheControl = cacheControl;
			}

			if (contentEncoding != null) {
				response.contentEncoding = <ContentEncodingKind> contentEncoding;
			}
		};

		const onResponse = (res: IncomingMessage|ClientHttp2Stream, client?: ClientHttp2Session) => {
			res.setEncoding("utf8");
			let data: string = "";
			res.on("data", (chunk) => {
				data += chunk;
			});
			res.on("end", () => {
				if (client != null) {
					client.close();
				}
				response.body = data;
				resolve(response);
			});
		};

		if (!rawRequest.http2) {
			const requestOptions: HttpRequestOptions = {
				protocol: "https:",
				host: rawRequest.host,
				port: rawRequest.port,
				path: rawRequest.path,
				method: rawRequest.method,
				headers: {
					...(rawRequest.acceptEncoding == null ? {} : {"Accept-Encoding": [...rawRequest.acceptEncoding].join(",")}),
					...(rawRequest.userAgent == null ? {} : {"User-Agent": rawRequest.userAgent})
				}
			};

			const incomingMessageHandler = (rawResponse: IncomingMessage) => {
				statusCode = rawResponse.statusCode;
				contentType = rawResponse.headers["content-type"];
				cacheControl = rawResponse.headers["cache-control"];
				contentEncoding = rawResponse.headers["content-encoding"];
				setResponseHeaders();
				onResponse(rawResponse);
			};

			const sentRequest = rawRequest.tls ? requestHttps({...requestOptions, rejectUnauthorized: false}, incomingMessageHandler) : requestHttp(requestOptions, incomingMessageHandler);
			sentRequest.end();
		}

		else {
			const client = connect(`https://${rawRequest.host}:${rawRequest.port}`, {rejectUnauthorized: false});
			const req = client.request({
					":path": rawRequest.path,
					":method": rawRequest.method,
					...(rawRequest.acceptEncoding == null ? {} : {"accept-encoding": [...rawRequest.acceptEncoding].join(",")}),
					...(rawRequest.userAgent == null ? {} : {"user-agent": rawRequest.userAgent})
				}
			);

			req.once("response", (headers) => {
				statusCode = <number><any> headers[":status"];
				contentType = headers["content-type"];
				cacheControl = headers["cache-control"];
				contentEncoding = headers["content-encoding"];
				setResponseHeaders();
			});

			onResponse(req);
			req.end();
		}
	});
}

/**
 * Picks the most favorable encoding to use from the given Set of encodings
 * @param {Set<string> | undefined} encodings
 * @returns {ContentEncodingKind | undefined}
 */
export function pickEncoding (encodings: Set<string>|undefined): ContentEncodingKind|undefined {
	if (encodings == null) return undefined;
	if (encodings.has(ContentEncodingKind.BROTLI)) return ContentEncodingKind.BROTLI;
	if (encodings.has(ContentEncodingKind.GZIP)) return ContentEncodingKind.GZIP;
	return undefined;
}