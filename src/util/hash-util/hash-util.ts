import {randomBytes} from "crypto";

export function generateRandomHash(complexity = 6): string {
	return randomBytes(complexity).toString("hex");
}
