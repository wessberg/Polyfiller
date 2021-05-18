import {randomBytes} from "crypto";

export function generateRandomHash(complexity = 6): string {
	return randomBytes(complexity).toString("hex");
}

export function isDefined<T>(element: T | undefined | null): element is T {
	return element != null;
}

/**
 * Converts the given string to a boolean
 */
export function booleanize(str: string): boolean {
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

/**
 * Ensures that the given item is in fact an array
 */
export function ensureArray<T>(item: T | T[]): T[] {
	return Array.isArray(item) ? item : [item];
}
