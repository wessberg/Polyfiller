import fetch, {Response} from "node-fetch";
import {container} from "../../src/services";
import {IConfig} from "../../src/config/i-config";
import {ApiMethod} from "../../src/api/server/i-server";

const config = container.get<IConfig>();

export interface SendRequestOptions {
	path: string;
	method?: ApiMethod;
	headers?: Partial<{
		"User-Agent": string;
		"Accept-Encoding": string;
	}>;
}

export async function sendRequest({path, method = "GET", headers = {}}: SendRequestOptions): Promise<Response> {
	return fetch(`http${config.https ? "s" : ""}://${config.host}:${config.port}${path}`, {
		method,
		headers
	});
}
