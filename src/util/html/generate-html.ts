import {constant} from "../../constant/constant";

/**
 * Generates some HTML contents with the given message
 * @param {string} message
 * @returns {string}
 */
export function generateHtml (message: string): string {
	// language=HTML
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>${constant.meta.name} v${constant.meta.version}</title>
		</head>
		<body>
			${message}
		</body>
		</html>
	`;
}

/**
 * Generates some HTML contents with the given message
 * @param {string} message
 * @param {number} code
 * @returns {string}
 */
export function generateErrorHtml (message: Error, code: number): string {
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