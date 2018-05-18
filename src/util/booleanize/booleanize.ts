/**
 * Converts the given string to a boolean
 * @param {string} str
 * @returns {boolean}
 */
export function booleanize (str: string): boolean {
	switch (str.toLowerCase().trim()) {
		case "true":
		case "yes":
		case "1":
			return true;
		case "false":
		case "no":
		case "0":
		case null:
			return false;
		default:
			return Boolean(str);
	}
}