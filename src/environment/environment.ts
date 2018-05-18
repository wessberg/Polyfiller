import {environmentDefaults} from "./environment-defaults";
import {uppercaseKeys} from "../util/uppercase-keys/uppercase-keys";

export const environment = {
	...environmentDefaults,
	...uppercaseKeys(process.env)
};