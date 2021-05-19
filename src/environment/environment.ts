import {environmentDefaults} from "./environment-defaults";
import {uppercaseKeys} from "../api/util";

export const environment = uppercaseKeys({
	...environmentDefaults,
	...process.env
});
