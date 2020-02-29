import {constant} from "../../constant/constant";

/**
 * Generates some HTML contents with the given message
 *
 * @param message
 * @returns
 */
export function generateHtml(message: string): string {
	// language=HTML
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>${constant.meta.name} v${constant.meta.version}</title>
			<style>
				body {
					background: rgba(0,0,0,.1);
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
				}
			</style>
		</head>
		<body>
			${message}
		</body>
		</html>
	`;
}

/**
 * Generates some HTML contents with the given message
 *
 * @param message
 * @param code
 * @returns
 */
export function generateErrorHtml(message: Error, code: number): string {
	// language=HTML
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>${constant.meta.name} v${constant.meta.version}</title>
		</head>
		<body>
			<h1>An Error occurred.</h1>
			<h5>Code: ${code}</h5>
			<p>${message.name}</p>
			<p>${message.stack}</p>
			${message}
		</body>
		</html>
	`;
}
