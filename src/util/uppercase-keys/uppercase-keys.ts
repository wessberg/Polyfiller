/**
 * Returns a new object with all of the keys uppercased
 * @param {T} obj
 * @returns {U}
 */
export function uppercaseKeys<T extends object, U extends object> (obj: T): U {
	const newObject = <U> {};
	Object.entries(obj).forEach(([key, value]) => {
		newObject[<keyof U> key.toUpperCase()] = value;
	});
	return newObject;
}