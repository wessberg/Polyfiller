import {IStaticBl} from "./i-static-bl";
import {constant} from "../../constant/constant";
import {generateHtml} from "../../util/html/generate-html";

/**
 * Business logic for static files
 */
export class StaticBl implements IStaticBl {
	/**
	 * Generates a HTML-formatted welcome message
	 * @returns {Promise<string>}
	 */
	public async getWelcomeMessage (): Promise<string> {
		return generateHtml(`
			<div style="display: flex; flex-direction: row;">
				<img style="margin-right: 30px" alt="logo" height="100" src="https://raw.githubusercontent.com/wessberg/Polyfiller/master/documentation/asset/logo-color.png" />
				<h1 style="box-shadow: 0 1px 0 0 rgba(0,0,0,1); display: inline-block">Welcome to ${constant.meta.name} v${constant.meta.version}</h1>
			</div>
			<h3>To use it, please send a request to the path: <code>${constant.endpoint.polyfill}</code> instead.</h3>
			<h3>For API reference, please see <a href="${constant.meta.github}">Github</a></h3>
			`);
	}

}