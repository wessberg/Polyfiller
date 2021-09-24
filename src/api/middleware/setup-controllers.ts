import {Express, NextFunction, Request, Response} from "express";
import {ApiControllers, ApiMethod, ApiRequest, ApiRequestHandler, ApiResponse} from "../server/i-server";
import {StatusCodes} from "http-status-codes";
import {URL} from "url";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";
import {parseContentEncodingKind} from "../util/util";
import {isDefined} from "../util";
import {ApiError} from "../lib/api-error";

export const SUPPORTED_API_METHODS: ApiMethod[] = ["GET", "PUT", "POST", "OPTIONS", "DELETE"];

export interface SetupControllersOptions {
	app: Express;
	controllers: ApiControllers;
}

/**
 * Splits a header that represents a comma-separated list
 */
function splitStringifiedListHeader(header: string | string[] | undefined): Set<ContentEncodingKind> {
	if (header == null) return new Set();
	const splitted = (Array.isArray(header) ? header : header.split(",").map(part => part.trim())).map(parseContentEncodingKind).filter(isDefined);

	return new Set(splitted);
}

function toApiRequest(request: Request): ApiRequest {
	return {
		request,
		url: new URL(
			// Replace all literal "+" with its literal encoded variant
			(request.url.startsWith("//") ? request.url.slice(1) : request.url).replace(/\+/g, "%2B"),
			`${request.protocol}://${request.get("host")}`
		),
		userAgent: request.header("user-agent") ?? "",
		acceptEncoding: request.header("accept-encoding") == null ? undefined : splitStringifiedListHeader(request.header("accept-encoding")),
		cachedChecksum: request.header("if-none-match")
	};
}

function respondToApiMethod(result: ApiResponse, res: Response, next: NextFunction): void {
	if (result == null) {
		return next();
	}

	if (result.headers != null) {
		for (const [key, value] of Object.entries(result.headers)) {
			// Ensure a proper UTF-8 based charset is being used
			if (key.toLowerCase() === "content-type" && !value.includes("charset")) {
				res.setHeader(key, `${value}; charset=utf-8`);
			} else {
				res.setHeader(key, value);
			}
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
}

export const setupControllers = (options: SetupControllersOptions) => {
	for (const controller of options.controllers) {
		if (controller.__apiMethods == null) continue;

		for (const method of SUPPORTED_API_METHODS) {
			const map = controller.__apiMethods[method];
			if (map == null) continue;

			const lowercasedMethod = method.toLowerCase() as Lowercase<typeof method>;

			for (const [path, methodName] of map) {
				options.app[lowercasedMethod](path, async (req, res, next) => {
					try {
						const result = await (controller[methodName] as ApiRequestHandler).call(controller, toApiRequest(req));
						return respondToApiMethod(result, res, next);
					} catch (ex: any) {
						next(ApiError.ensureApiError(ex));
					}
				});
			}
		}
	}
};
