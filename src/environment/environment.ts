import "dotenv/config";

import {uppercaseKeys} from "../api/util.js";

// load .env file
export const environment = uppercaseKeys(process.env as Record<string, unknown>);
