import {container} from "../../src/services";

import test from "ava";
import {constants} from "http2";
import {IConfig} from "../../src/config/i-config";
import {sendRequest} from "../../src/util/request-util/request-util";
import {constant} from "../../src/constant/constant";
import {initializeTests} from "./setup";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import {chrome, ie} from "useragent-generator";
import {ContentEncodingKind} from "../../src/encoding/content-encoding-kind";
import {getPolyfillRequestFromUrl} from "../../src/util/polyfill/polyfill-util";
import {URL} from "url";
import {PolyfillDictNormalizedEntry} from "../../src/polyfill/polyfill-dict";

const config = container.get<IConfig>();

test.before(initializeTests);

test("Delegates requests to '/' to the StaticController", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: false,
		method: "GET",
		host: config.host,
		port: config.port,
		path: (Array.isArray(constant.endpoint.index) ? constant.endpoint.index[0] : constant.endpoint.index) as string
	});

	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});

test("Delegates requests to '/polyfill' to the PolyfillController", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: false,
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
		tls: false,
		userAgent: "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3450.0 Mobile Safari/537.36",
		method: "GET",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=intersection-observer,zone,es2015,es2016+`,
		acceptEncoding: new Set([ContentEncodingKind.BROTLI])
	});

	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});

test("Is able to generate a bundle of every available polyfill", async t => {
	const features = Object.entries(constant.polyfill)
		.filter(([, value]) => !("polyfills" in value))
		.map(([key, value]) => {
			if (key === "zone") {
				return `${key}|${Object.keys(((value as unknown) as PolyfillDictNormalizedEntry).meta!).join("|")}|force`;
			} else if (key.startsWith("intl.")) {
				return `${key}|locale=en~da|force`;
			} else {
				return `${key}|force`;
			}
		});

	const result = await sendRequest({
		http2: config.http2,
		tls: false,
		userAgent: "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3450.0 Mobile Safari/537.36",
		method: "GET",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=${features.join(",")}`,
		acceptEncoding: undefined
	});

	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});

test("Will generate correct polyfills for IE11. #1", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: false,
		userAgent: ie("11"),
		method: "GET",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=web-components,es,class-list,systemjs|variant=system,custom-event,url,fetch,object-fit,intersection-observer,animation,regenerator-runtime,requestanimationframe,requestidlecallback,resize-observer,pointer-event,dom.collections.iterable,scroll-behavior,zone|error|shadydom,esnext.reflect,intl|force|locale=en~da`,
		acceptEncoding: undefined
	});

	t.true(result.statusCode === constants.HTTP_STATUS_OK);
});

test("Will inline regenerator-runtime if required. #1", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: false,
		userAgent: ie("11"),
		method: "GET",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=form-data`,
		acceptEncoding: undefined
	});

	if (!("body" in result)) {
		t.false("The API didn't have a body");
	} else {
		t.false(result.body.toString().includes(`require("regenerator-runtime")`));
	}
});

test("Will correctly parse meta information for SystemJS. #1", async t => {
	const polyfillRequest = getPolyfillRequestFromUrl(new URL("?features=systemjs|variant=s", `https://my-polyfill-service.app${constant.endpoint.polyfill}`), chrome(70));
	t.true([...polyfillRequest.features].some(({meta, name}) => name === "systemjs" && meta != null && meta.variant === "s"));
});

test("Will correctly parse meta information for SystemJS. #2", async t => {
	const polyfillRequest = getPolyfillRequestFromUrl(new URL("?features=systemjs|variant=system", `https://my-polyfill-service.app${constant.endpoint.polyfill}`), chrome(70));
	t.true([...polyfillRequest.features].some(({meta, name}) => name === "systemjs" && meta != null && meta.variant === "system"));
});

test("Will correctly parse meta information for Zone. #1", async t => {
	const polyfillRequest = getPolyfillRequestFromUrl(new URL("?features=zone|error", `https://my-polyfill-service.app${constant.endpoint.polyfill}`), chrome(70));
	t.true([...polyfillRequest.features].some(({meta, name}) => name === "zone" && meta != null && meta.error === true));
});

test("Will set a 'x-applied-polyfills' header on HTTP2 responses with a HTTP-friendly list of all applied polyfills. #1", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: false,
		userAgent: ie("11"),
		method: "GET",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=event,custom-event,zone,es.promise.finally,pointer-event|force,systemjs|variant=system,intl|force|locale=en~da&context=node`,
		acceptEncoding: undefined
	});

	t.true(result.polyfillsHeader != null);
});

test("Accepts OPTIONS requests. #1", async t => {
	const result = await sendRequest({
		http2: config.http2,
		tls: false,
		userAgent: ie("11"),
		method: "OPTIONS",
		host: config.host,
		port: config.port,
		path: `${constant.endpoint.polyfill}?features=event,custom-event,zone,es.promise.finally,pointer-event|force,systemjs|variant=system,intl|force|locale=en~da`,
		acceptEncoding: undefined
	});

	t.true(result.statusCode === 200);
});

test("Will correctly parse meta information for 'shadow-dom'. #1", async t => {
	const polyfillRequest = getPolyfillRequestFromUrl(new URL("?features=shadow-dom|experimental", `https://my-polyfill-service.app${constant.endpoint.polyfill}`), chrome(70));
	t.true([...polyfillRequest.features].some(({meta, name}) => name === "shadow-dom" && meta != null && meta.experimental === true));
});

test("Will correctly parse meta information for 'shadow-dom' when using the alias 'web-components'. #1", async t => {
	const polyfillRequest = getPolyfillRequestFromUrl(new URL("?features=web-components|experimental", `https://my-polyfill-service.app${constant.endpoint.polyfill}`), chrome(70));
	t.true([...polyfillRequest.features].some(({meta, name}) => name === "shadow-dom" && meta != null && meta.experimental === true));
});
