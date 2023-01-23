/* eslint-disable @typescript-eslint/naming-convention */
import {container} from "../../src/services.js";
import {ApiMethod} from "../../src/api/server/i-server.js";
import {Config} from "../../src/config/config.js";

const config = container.get<Config>();

export interface SendRequestOptions {
	path: string;
	method?: ApiMethod;
	headers?: Partial<{
		"User-Agent": string;
		"Accept-Encoding": string;
		Accept: string;
	}>;
}

export async function sendRequest({path, method = "GET", headers = {}}: SendRequestOptions): Promise<Response> {
	return fetch(`http${config.https ? "s" : ""}://${config.host}:${config.port}${path}`, {
		method,
		headers
	});
}
