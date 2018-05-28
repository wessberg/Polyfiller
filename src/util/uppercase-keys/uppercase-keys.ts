/**
 * Returns a new object with all of the keys uppercased
 * @param {T} obj
 * @returns {U}
 */
export function uppercaseKeys<T extends object> (obj: T): T {
	const newObject = <T> {};
	Object.entries(obj).forEach(([key, value]) => {
		newObject[<keyof T> key.toUpperCase()] = value;
	});
	return newObject;
}