/* eslint-disable @typescript-eslint/ban-ts-ignore,@typescript-eslint/no-explicit-any */
import {IncomingHttpHeaders, IncomingMessage, request as requestHttp, RequestOptions as HttpRequestOptions} from "http";
import {request as requestHttps} from "https";
import {IRawRequest, Request} from "../../server/i-request";
import {IOKResponse, Response} from "../../server/i-response";
import chalk from "chalk";
import {ClientHttp2Session, ClientHttp2Stream, connect} from "http2";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";
import {URL} from "url";
import {constant} from "../../constant/constant";
import {Method} from "../../server/method";

const GET_COLOR = chalk.green;
const PUT_COLOR = chalk.yellow;
const DELETE_COLOR = chalk.red;
const POST_COLOR = chalk.blue;
const OPTIONS_COLOR = chalk.gray;

/**
 * Splits a header that represents a comma-separated list
 */
function splitStringifiedListHeader(header: string | string[]): Set<string> {
	const splitted = Array.isArray(header) ? header : header.split(",").map(part => part.trim());

	return new Set(splitted);
}

/**
 * Gets an IRequest from the given IncomingHttpHeaders
 */
export function getRequestFromIncomingHeaders(headers: IncomingHttpHeaders, http2: boolean): Request {
	let path = headers[":path"];
	if (typeof path === "string") {
		// Replace all literal "+" with its literal encoded variant
		path = path.replace(/\+/g, "%2B");
	}

	return {
		http2,
		method: headers[":method"] == null ? "OPTIONS" : (headers[":method"] as Method),
		accept: headers.accept == null ? undefined : splitStringifiedListHeader(headers.accept),
		acceptEncoding: headers["accept-encoding"] == null ? undefined : splitStringifiedListHeader(headers["accept-encoding"]),
		acceptLanguage: headers["accept-language"] == null ? undefined : splitStringifiedListHeader(headers["accept-language"]),
		userAgent: headers["user-agent"] != null ? headers["user-agent"] : "",
		referer: headers[":referer"] != null ? (headers[":referer"] as string) : headers.referer != null ? headers.referer : "",
		url: new URL(path as string, `${headers[":scheme"]}://${headers[":authority"]}`),
		cachedChecksum: headers["if-none-match"]
	} as Request;
}

/**
 * Paints the given method with Chalk. Each method has its' own color
 */
function paintMethod(method: Request["method"]): string {
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
 *
 * @param request
 */
export function printRequest({method, url, userAgent, referer}: Request): void {
	console.log(
		`${paintMethod(method)} ${url.toString()} (${chalk.gray(userAgent)}) ${referer != null && referer.length > 0 ? `(${chalk.yellow(referer)})` : ``}`
	);
}

/**
 * Sends the given request and returns a Promise of the result
 */
export async function sendRequest(rawRequest: IRawRequest): Promise<Response> {
	return new Promise<Response>(async resolve => {
		const response: IOKResponse = {
			contentType: "text/plain",
			statusCode: 0,
			body: "",
			checksum: "",
			polyfillsHeader: ""
		};

		let contentType: string | undefined;
		let cacheControl: string | undefined;
		let statusCode: number | undefined;
		let contentEncoding: string | undefined;
		let checksum: string | undefined;
		let polyfillsHeader: string | undefined;

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
				response.contentEncoding = contentEncoding as ContentEncodingKind;
			}

			if (checksum != null) {
				response.checksum = checksum;
			}

			if (polyfillsHeader != null) {
				response.polyfillsHeader = polyfillsHeader;
			}
		};

		const onResponse = (res: IncomingMessage | ClientHttp2Stream, client?: ClientHttp2Session) => {
			res.setEncoding("utf8");
			let data = "";
			// @ts-ignore
			res.on("data", (chunk: any): void => {
				data += chunk;
			});

			// @ts-ignore
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
				polyfillsHeader = rawResponse.headers[constant.header.polyfills] as string | undefined;
				checksum = rawResponse.headers.etag as string | undefined;
				setResponseHeaders();
				onResponse(rawResponse);
			};

			const sentRequest = rawRequest.tls
				? requestHttps({...requestOptions, rejectUnauthorized: false}, incomingMessageHandler)
				: requestHttp(requestOptions, incomingMessageHandler);
			sentRequest.end();
		} else {
			const client = connect(`https://${rawRequest.host}:${rawRequest.port}`, {rejectUnauthorized: false});
			const req = client.request({
				":path": rawRequest.path,
				":method": rawRequest.method,
				...(rawRequest.acceptEncoding == null ? {} : {"accept-encoding": [...rawRequest.acceptEncoding].join(",")}),
				...(rawRequest.userAgent == null ? {} : {"user-agent": rawRequest.userAgent})
			});

			req.once("response", headers => {
				statusCode = (headers[":status"] as unknown) as number;
				contentType = headers["content-type"];
				cacheControl = headers["cache-control"];
				contentEncoding = headers["content-encoding"];
				polyfillsHeader = headers[constant.header.polyfills] as string | undefined;
				checksum = headers.etag as string | undefined;
				setResponseHeaders();
			});

			onResponse(req);
			req.end();
		}
	});
}

/**
 * Picks the most favorable encoding to use from the given Set of encodings
 *
 * @param encodings
 * @returns
 */
export function pickEncoding(encodings: Set<string> | undefined): ContentEncodingKind | undefined {
	if (encodings == null) return undefined;
	if (encodings.has(ContentEncodingKind.BROTLI)) return ContentEncodingKind.BROTLI;
	if (encodings.has(ContentEncodingKind.GZIP)) return ContentEncodingKind.GZIP;
	return undefined;
}
