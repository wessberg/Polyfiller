import "../../src/services";

import {test} from "ava";
import {constants} from "http2";
import {DIContainer} from "@wessberg/di";
import {IConfig} from "../../src/config/i-config";
import {sendRequest} from "../../src/util/request-util/request-util";
import {constant} from "../../src/constant/constant";
import {initializeTests} from "./setup";
// @ts-ignore
import {chrome, ie} from "useragent-generator";
import {ContentEncodingKind} from "../../src/encoding/content-encoding-kind";

const config = DIContainer.get<IConfig>();

test.before(initializeTests);

test("Delegates requests to '/' to the StaticController", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: true,
		method: "GET",
		host: config.host,
		port: config.port,
		path: <string> (Array.isArray(constant.endpoint.index) ? constant.endpoint.index[0] : constant.endpoint.index)
	});

	if ("body" in result) {
		console.log("body length:", result.body.length);
	}

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
		path: `${constant.endpoint.polyfill}?features=object-fit|force`,
		acceptEncoding: new Set([ContentEncodingKind.BROTLI])
	});

	if ("body" in result) {
		console.log("checksum:", result.checksum);
		console.log("body length:", result.body.length);
	}
	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});

test("Will not generate polyfills for 'Element' on Chrome 69 for a Galaxy S5", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: true,
		userAgent: "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3450.0 Mobile Safari/537.36",
		method: "GET",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=intersection-observer,zone,es2015,es2016+`,
		acceptEncoding: new Set([ContentEncodingKind.BROTLI])
	});

	if ("body" in result) {
		console.log("checksum:", result.checksum);
		console.log("body length:", result.body.length);
	}
	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});

test.only("Will generate correct polyfills for IE11", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: true,
		userAgent: ie("11"),
		method: "GET",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=es`,
		acceptEncoding: undefined
	});

	if ("body" in result) {
		console.log("checksum:", result.checksum);
		console.log("body length:", result.body.length);
	}
	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});