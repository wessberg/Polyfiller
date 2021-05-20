import {NextFunction, Request, Response} from "express";
import {ApiError} from "../lib/api-error";
import {generateErrorHtml} from "../../util/html/generate-html";
import {pickAccept} from "../util/util";

interface ErrorMiddlewareOptions {}

export const errorMiddleware =
	(_options: Partial<ErrorMiddlewareOptions> = {}) =>
	async (ex: Error | ApiError, req: Request, res: Response, _: NextFunction): Promise<void> => {
		const apiError = ApiError.ensureApiError(ex);

		const contentType = pickAccept(req.header("accept"));

		res.setHeader("Content-Type", contentType);
		res
			.status(apiError.status)
			.send(contentType === "text/html" ? generateErrorHtml(apiError) : apiError.toJSON())
			.end();
	};
