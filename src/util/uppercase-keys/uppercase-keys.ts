/**
 * Returns a new object with all of the keys uppercased
 */
export function uppercaseKeys<T extends object>(obj: T): T {
	const newObject = {} as T;
	Object.entries(obj).forEach(([key, value]) => {
		newObject[key.toUpperCase() as keyof T] = value;
	});
	return newObject;
}
