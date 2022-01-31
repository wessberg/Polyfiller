/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from "express";
import {ApiError} from "../lib/api-error";
import {generateErrorHtml} from "../../util/html/generate-html";
import {pickAccept} from "../util/util";

interface ErrorMiddlewareOptions {
	removeStackTrace: boolean;
}

export const errorMiddleware =
	(options: Partial<ErrorMiddlewareOptions> = {}) =>
	async (ex: Error | ApiError, req: Request, res: Response, _: NextFunction): Promise<void> => {
		const apiError = ApiError.ensureApiError(ex);

		const contentType = pickAccept(req.header("accept"));

		res.setHeader("Content-Type", contentType);
		res
			.status(apiError.status)
			.send(contentType === "text/html" ? generateErrorHtml(apiError, options.removeStackTrace) : apiError.toJSON())
			.end();
	};
