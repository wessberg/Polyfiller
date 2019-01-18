import {container} from "../../src/services";

import test from "ava";
import {constants} from "http2";
import {IConfig} from "../../src/config/i-config";
import {sendRequest} from "../../src/util/request-util/request-util";
import {constant} from "../../src/constant/constant";
import {initializeTests} from "./setup";
// @ts-ignore
import {chrome, ie} from "useragent-generator";
import {ContentEncodingKind} from "../../src/encoding/content-encoding-kind";
import {getPolyfillRequestFromUrl} from "../../src/util/polyfill/polyfill-util";
import {URL} from "url";

// tslint:disable:no-identical-functions

const config = container.get<IConfig>();

test.before(initializeTests);

test("Delegates requests to '/' to the StaticController", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: true,
		method: "GET",
		host: config.host,
		port: config.port,
		path: <string>(Array.isArray(constant.endpoint.index) ? constant.endpoint.index[0] : constant.endpoint.index)
	});

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

	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});

test("Will generate correct polyfills for IE11", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: true,
		userAgent: ie("11"),
		method: "GET",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=event,custom-event,zone,es.promise.finally,pointer-event|force,systemjs|variant=system`,
		acceptEncoding: undefined
	});

	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});

test("Will correctly parse meta information for SystemJS. #1", async t => {

	const polyfillRequest = getPolyfillRequestFromUrl(
		new URL("?features=systemjs|variant=s", `https://my-polyfill-service.app${constant.endpoint.polyfill}`),
		chrome(70)
	);
	t.true([...polyfillRequest.features].some(({meta, name}) => name === "systemjs" && meta != null && meta.variant === "s"));
});

test("Will correctly parse meta information for SystemJS. #2", async t => {

	const polyfillRequest = getPolyfillRequestFromUrl(
		new URL("?features=systemjs|variant=system", `https://my-polyfill-service.app${constant.endpoint.polyfill}`),
		chrome(70)
	);
	t.true([...polyfillRequest.features].some(({meta, name}) => name === "systemjs" && meta != null && meta.variant === "system"));
});

test("Will correctly parse meta information for Zone. #1", async t => {

	const polyfillRequest = getPolyfillRequestFromUrl(
		new URL("?features=zone|error", `https://my-polyfill-service.app${constant.endpoint.polyfill}`),
		chrome(70)
	);
	t.true([...polyfillRequest.features].some(({meta, name}) => name === "zone" && meta != null && meta.error === true));
});

test("Will set a 'x-applied-polyfills' header on HTTP2 responses with a HTTP-friendly list of all applied polyfills. #1", async t => {

	const result = await sendRequest({
		http2: config.http2,
		tls: true,
		userAgent: ie("11"),
		method: "GET",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=event,custom-event,zone,es.promise.finally,pointer-event|force,systemjs|variant=system,intl|force|locale=en~da`,
		acceptEncoding: undefined
	});

	t.true(result.polyfillsHeader != null);
});

test("Accepts OPTIONS requests. #1", async t => {

	const result = await sendRequest({
		http2: config.http2,
		tls: true,
		userAgent: ie("11"),
		method: "OPTIONS",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=event,custom-event,zone,es.promise.finally,pointer-event|force,systemjs|variant=system,intl|force|locale=en~da`,
		acceptEncoding: undefined
	});

	t.true(result.statusCode === 200);
});