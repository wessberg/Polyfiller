import {NextFunction, Request, Response} from "express";
import {ApiControllers} from "../server/i-server";
import {StatusCodes} from "http-status-codes";
import {generateErrorHtml} from "../../util/html/generate-html";

export interface ControllerMiddlewareOptions {
	controllers: ApiControllers;
}

export const errorMiddleware = async (ex: Error, _req: Request, res: Response, _: NextFunction): Promise<void> => {
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

	return res.status(statusCode).send(generateErrorHtml(ex, statusCode)).end();
};
