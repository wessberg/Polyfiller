import {randomBytes} from "crypto";
import {UppercaseKeys} from "../common/type/type-util";

export function generateRandomHash(complexity = 6): string {
	return randomBytes(complexity).toString("hex");
}

export function isDefined<T>(element: T | undefined | null): element is T {
	return element != null;
}

/**
 * Converts the given string to a boolean
 */
export function booleanize(str: string | undefined): boolean {
	if (str == null) return false;
	switch (str.toLowerCase().trim()) {
		case "true":
		case "yes":
		case "y":
		case "1":
			return true;
		case "false":
		case "no":
		case "n":
		case "0":
		case null:
			return false;
		default:
			return Boolean(str);
	}
}

/**
 * Ensures that the given item is in fact an array
 */
export function ensureArray<T>(item: T | T[]): T[] {
	return Array.isArray(item) ? item : [item];
}

/**
 * Returns a new object with all of the keys uppercased
 */
export function uppercaseKeys<T extends Record<PropertyKey, unknown>>(obj: T): UppercaseKeys<T> {
	const newObject = {} as UppercaseKeys<T>;
	const entries = Object.entries(obj) as [keyof T & string, T[keyof T]][];
	entries.forEach(([key, value]) => {
		const uppercasedKey = key.toUpperCase() as Uppercase<string & keyof T>;
		newObject[uppercasedKey] = value as UppercaseKeys<T>[keyof UppercaseKeys<T>];
	});
	return newObject;
}
