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
			<h1>Welcome to ${constant.meta.name} v${constant.meta.version}</h1>
			<h3>To use it, please send a request to the path: <code>${constant.endpoint.polyfill}</code> instead.</h3>
			<h3>For API reference, please see <a href="${constant.meta.github}">Github</a></h3>
			`);
	}

}