import "../../src/services";

import {test} from "ava";
import {constants} from "http2";
import {DIContainer} from "@wessberg/di";
import {IConfig} from "../../src/config/i-config";
import {sendRequest} from "../../src/util/request-util/request-util";
import {constant} from "../../src/constant/constant";
import {setupTests} from "./setup";
// @ts-ignore
import {chrome} from "useragent-generator";
import {ContentEncodingKind} from "../../src/encoding/content-encoding-kind";

const config = DIContainer.get<IConfig>();

test.beforeEach(setupTests);

test("Delegates requests to '/' to the StaticController", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: true,
		method: "GET",
		host: config.host,
		port: config.port,
		path: <string> (Array.isArray(constant.endpoint.index) ? constant.endpoint.index[0] : constant.endpoint.index)
	});

	console.log("body length:", result.body.length);

	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});

test("Delegates requests to '/polyfill' to the PolyfillController", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: true,
		userAgent: chrome("66"),
		method: "GET",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=es2016+.object|force,intl|force`,
		acceptEncoding: new Set([ContentEncodingKind.BROTLI])
	});

	console.log("body length:", result.body.length);
	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});