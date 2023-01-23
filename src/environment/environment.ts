import {environmentDefaults} from "./environment-defaults.js";
import {uppercaseKeys} from "../api/util.js";

export const environment = uppercaseKeys({
	...environmentDefaults,
	...process.env
});
