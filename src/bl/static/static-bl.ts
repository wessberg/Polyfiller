import type {IStaticBl} from "./i-static-bl.js";
import {constant} from "../../constant/constant.js";
import {generateHtml} from "../../util/html/generate-html.js";

/**
 * Business logic for static files
 */
export class StaticBl implements IStaticBl {
	/**
	 * Generates a HTML-formatted welcome message
	 *
	 * @returns
	 */
	async getWelcomeMessage(contentType: "text/html" | "application/json"): Promise<string> {
		switch (contentType) {
			case "text/html":
				return generateHtml(`
			<div style="display: flex; flex-direction: row;">
				<img style="margin-right: 30px" alt="logo" height="100" src="https://raw.githubusercontent.com/wessberg/Polyfiller/master/documentation/asset/logo-color.png" />
				<h1 style="box-shadow: 0 1px 0 0 rgba(0,0,0,1); display: inline-block">Welcome to ${constant.meta.name} v${constant.meta.version}</h1>
			</div>
			<h3>To use it, please send a request to the path: <code>${constant.endpoint.polyfill}</code> instead.</h3>
			<h3>For API reference, please see <a href="${constant.meta.github}">Github</a></h3>
			`);
			case "application/json":
				return JSON.stringify(
					{
						title: `Welcome to ${constant.meta.name} v${constant.meta.version}`,
						description: `To use it, please send a request to the path: ${constant.endpoint.polyfill} instead. For API reference, please see Github: ${constant.meta.github}`
					},
					null,
					"  "
				);
		}
	}
}
