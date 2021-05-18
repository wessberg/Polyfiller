import {NextFunction, Request, Response} from "express";
import {ApiControllers, ApiMethod, ApiRequest, ApiRequestHandler, ApiResponse} from "../server/i-server";
import {parseApiMethod, parseContentEncodingKind} from "../util/util";
import {StatusCodes} from "http-status-codes";
import {isDefined} from "../../common/util/util";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";
import {URL} from "url";

export interface ControllerMiddlewareOptions {
	controllers: ApiControllers;
}

export const controllerMiddleware =
	(options: ControllerMiddlewareOptions) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const method = parseApiMethod(req.method);
			if (method == null) {
				return next();
			}

			const result = await findAndInvokeApiMethod(req, method, options);
			if (result == null) {
				return next();
			}

			if (result.headers != null) {
				for (const [key, value] of Object.entries(result.headers)) {
					res.setHeader(key, value);
				}
			}

			if (result.statusCode == StatusCodes.TEMPORARY_REDIRECT && typeof result.body === "string") {
				res.redirect(result.body);
			} else {
				if (result.body != null) {
					res.setHeader("Content-Length", Buffer.byteLength(result.body as string | Buffer));
				}

				res.status(result.statusCode).send(result.body).end();
			}
			next();
		} catch (ex) {
			next(ex);
		}
	};

/**
 * Splits a header that represents a comma-separated list
 */
function splitStringifiedListHeader(header: string | string[]): Set<ContentEncodingKind> {
	const splitted = (Array.isArray(header) ? header : header.split(",").map(part => part.trim())).map(parseContentEncodingKind).filter(isDefined);

	return new Set(splitted);
}

function toApiRequest(request: Request): ApiRequest {
	return {
		request,
		url: new URL(
			// Replace all literal "+" with its literal encoded variant
			request.url.replace(/\+/g, "%2B"),
			`${request.protocol}://${request.get("host")}`
		),
		userAgent: request.headers["user-agent"] ?? "",
		acceptEncoding: request.headers["accept-encoding"] == null ? undefined : splitStringifiedListHeader(request.headers["accept-encoding"]),
		cachedChecksum: request.headers["if-none-match"]
	};
}

async function findAndInvokeApiMethod(req: Request, method: ApiMethod, options: ControllerMiddlewareOptions): Promise<ApiResponse | void> {
	for (const controller of options.controllers) {
		if (controller.__apiMethods == null) continue;
		const map = controller.__apiMethods[method];
		if (map == null) continue;

		for (const [path, methodName] of map) {
			if (typeof path === "string" ? path === req.path : path.test(req.path)) {
				// Upgrade the request object first
				return (controller[methodName] as ApiRequestHandler).call(controller, toApiRequest(req));
			}
		}
	}
}
