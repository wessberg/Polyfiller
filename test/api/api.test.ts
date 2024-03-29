/* eslint-disable @typescript-eslint/naming-convention */
import test from "ava";
import {constant} from "../../src/constant/constant.js";
import {initializeTests} from "./setup.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {chrome, ie} from "useragent-generator";
import {getPolyfillRequestFromUrl} from "../../src/util/polyfill/polyfill-util.js";
import {URL} from "url";
import type {PolyfillDictNormalizedEntry} from "../../src/polyfill/polyfill-dict.js";
import {sendRequest} from "./util.js";
import {StatusCodes} from "http-status-codes";
import type {IMetricsService} from "../../src/service/metrics/i-metrics-service.js";
import {container} from "../../src/services.js";

test.before(initializeTests);

test(`Generates an HTML-formatted welcome page when a request is sent to '${constant.endpoint.index}'`, async t => {
	const result = await sendRequest({
		path: constant.endpoint.index
	});

	const arrayBuffer = await result.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	if (!result.ok) {
		t.fail(buffer.toString());
	} else {
		t.true(buffer.toString().includes("Welcome to "));
	}
});

test(`Generates an HTML-formatted welcome page when a request is sent to '/'`, async t => {
	const result = await sendRequest({
		path: "/"
	});

	const arrayBuffer = await result.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	if (!result.ok) {
		t.fail(buffer.toString());
	} else {
		t.true(buffer.toString().includes("Welcome to "));
	}
});

test(`Generates an JSON-formatted welcome payload when a request is sent to '${constant.endpoint.index}' with the {Accept: application/json} header`, async t => {
	const result = await sendRequest({
		path: constant.endpoint.index,
		headers: {
			Accept: "application/json"
		}
	});

	const data: {title?: string} = await result.json();

	if (!result.ok) {
		t.fail("Expected result to be OK");
	} else {
		t.true("title" in data && data?.title?.includes("Welcome to"));
	}
});

test(`Sends metrics data when an unsupported User-Agent header is discovered, but still responds with OK`, async t => {
	const metricsService = container.get<IMetricsService>();
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=intersection-observer`,
		headers: {
			"User-Agent": "Lizard/5.0 (Doors; U; IEMS 90.0; Doors NT 90.0; en-US);"
		}
	});

	if (!result.ok) {
		t.fail("Expected an OK response");
	} else {
		t.true(metricsService.hasCapturedExceptions);
	}
});

test("Delegates requests to '/' to the StaticController", async t => {
	const result = await sendRequest({
		path: (Array.isArray(constant.endpoint.index) ? constant.endpoint.index[0] : constant.endpoint.index) as string
	});

	t.true(result.status === StatusCodes.OK);
});

test("Delegates requests to '/polyfill' to the PolyfillController", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=object-fit|force`,
		headers: {
			"User-Agent": chrome("66"),
			"Accept-Encoding": "br"
		}
	});

	t.true(result.status === StatusCodes.OK);
});

test("Will not generate polyfills for 'Element' on Chrome 69 for a Galaxy S5", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=intersection-observer,zone,es2015,es2016+`,
		headers: {
			"User-Agent": "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3450.0 Mobile Safari/537.36",
			"Accept-Encoding": "br"
		}
	});

	t.true(result.status === StatusCodes.OK);
});

test("Supports >= es2022 as a target", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=es.global-this`,
		headers: {
			"User-Agent": chrome(100),
			"Accept-Encoding": "none"
		}
	});

	t.true(result.status === StatusCodes.OK);
});

test("Will compress with Brotli if the 'Accept-Encoding' header is set and it accepts Brotli compression", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=intersection-observer`,
		headers: {
			"User-Agent": ie("11"),
			"Accept-Encoding": "br"
		}
	});

	t.deepEqual(result.headers.get("Content-Encoding"), "br");
});

test("Is able to generate a bundle of every available polyfill", async t => {
	const features = Object.entries(constant.polyfill)
		.filter(([, value]) => !("polyfills" in value))
		.map(([key, value]) => {
			if (key === "zone") {
				return `${key}|${Object.keys((value as unknown as PolyfillDictNormalizedEntry).meta!).join("|")}|force`;
			} else if (key.startsWith("intl.")) {
				return `${key}|locale=en~da|force`;
			} else {
				return `${key}|force`;
			}
		});

	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=${features.join(",")}`,
		headers: {
			"User-Agent": "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3450.0 Mobile Safari/537.36"
		}
	});

	t.true(result.status === StatusCodes.OK);
});

test("Will generate correct polyfills for IE11. #1", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=web-components,es,class-list,systemjs|variant=system,custom-event,url,fetch,object-fit,intersection-observer,animation,regenerator-runtime,requestanimationframe,requestidlecallback,resize-observer,pointer-event,dom.collections.iterable,scroll-behavior,zone|error|shadydom.reflect,intl|force|locale=en~da`,
		headers: {
			"User-Agent": ie("11")
		}
	});

	t.true(result.status === StatusCodes.OK);
});

test("Won't include web components polyfills for Firefox 109 on Android 13. #1", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=web-components`,
		headers: {
			"User-Agent": `Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/109/0 Firefox/109.0`
		}
	});

	t.false(result.headers.get(constant.header.polyfills)?.includes("shadow-dom"));
});

test("Will generate correct polyfills for IE11. #2", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?minify&features=web-components|experimental|lit,es,class-list,custom-event,url,fetch,object-fit,animation,requestanimationframe,requestidlecallback,resize-observer,pointer-event,dom.collections.iterable,scroll-behavior,intl|locale=cs-CZ~da~de~en~es~fi-FI~fr~hr-HR~hu-HU~it~ja~ko~nl~no~pl~pt-BR~ru~sk-SK~sv~zh-Hans~vi,formdata,broadcast-channel,systemjs|variant=s`,
		headers: {
			"User-Agent": ie("11")
		}
	});

	t.true(result.status === StatusCodes.OK);
});

test("Won't crash for invalid URLs. #1", async t => {
	const result = await sendRequest({
		path: `//?foo`,
		headers: {
			"User-Agent": ie("11")
		}
	});

	t.true(result.status === StatusCodes.OK);
});

test("Will correctly escape unicode escape sequences. #1", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=intl.number-format`,
		headers: {
			"User-Agent": ie("11")
		}
	});

	const arrayBuffer = await result.arrayBuffer();
	const body = Buffer.from(arrayBuffer);

	if (!result.ok) {
		t.fail(body.toString());
	} else {
		t.false(body.toString().includes(`u{1e950}`));
		t.false(body.toString().includes(`u{660}`));
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

test("Will inline regenerator-runtime if required. #1", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=form-data`,
		headers: {
			"User-Agent": ie("11")
		}
	});

	const arrayBuffer = await result.arrayBuffer();
	const body = Buffer.from(arrayBuffer);

	if (!result.ok) {
		t.fail(body.toString());
	} else {
		t.false(body.toString().includes(`require("regenerator-runtime")`));
	}
});

test("Will inline regenerator-runtime if required. #2", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=web-components`,
		headers: {
			"User-Agent": ie("11")
		}
	});

	const arrayBuffer = await result.arrayBuffer();
	const body = Buffer.from(arrayBuffer);

	if (!result.ok) {
		t.fail(body.toString());
	} else {
		t.false(body.toString().includes(`import regeneratorRuntime from"regenerator-runtime";`));
		t.false(body.toString().includes(`import regeneratorRuntime from "regenerator-runtime";`));
	}
});

test("Generates SourceMap if required. #1", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=form-data&sourcemap`,
		headers: {
			"User-Agent": chrome("70")
		}
	});

	const arrayBuffer = await result.arrayBuffer();
	const body = Buffer.from(arrayBuffer);

	if (!result.ok) {
		t.fail(body.toString());
	} else {
		t.true(body.toString().includes(`//# sourceMappingURL=data:application/json;base64`));
	}
});

test("Will set a 'x-applied-polyfills' header on HTTP responses with a HTTP-friendly list of all applied polyfills. #1", async t => {
	const result = await sendRequest({
		path: `${constant.endpoint.polyfill}?features=event,custom-event,zone,es.promise.finally,pointer-event|force,systemjs|variant=system,intl|force|locale=en~da&context=node`,
		headers: {
			"User-Agent": ie("11")
		}
	});

	t.true(result.headers.get(constant.header.polyfills) != null);
});

test("Accepts OPTIONS requests. #1", async t => {
	const result = await sendRequest({
		method: "OPTIONS",
		path: `${constant.endpoint.polyfill}?features=event,custom-event,zone,es.promise.finally,pointer-event|force,systemjs|variant=system,intl|force|locale=en~da`
	});

	t.true(result.status === 200);
});

test("Will correctly parse meta information for 'shadow-dom'. #1", async t => {
	const polyfillRequest = getPolyfillRequestFromUrl(new URL("?features=shadow-dom|experimental|lit", `https://my-polyfill-service.app${constant.endpoint.polyfill}`), chrome(70));
	t.true([...polyfillRequest.features].some(({meta, name}) => name === "shadow-dom" && meta != null && meta.experimental === true && meta.lit === true));
});

test("Will correctly parse meta information for 'shadow-dom' when using the alias 'web-components'. #1", async t => {
	const polyfillRequest = getPolyfillRequestFromUrl(
		new URL("?features=web-components|experimental|lit", `https://my-polyfill-service.app${constant.endpoint.polyfill}`),
		chrome(70)
	);
	t.true([...polyfillRequest.features].some(({meta, name}) => name === "shadow-dom" && meta != null && meta.experimental === true && meta.lit === true));
});
