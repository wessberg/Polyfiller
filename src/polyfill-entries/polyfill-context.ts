import {ElementOf} from "helpertypes";

export const POLYFILL_CONTEXTS = ["node", "window", "worker"] as const;

export type PolyfillContext = ElementOf<typeof POLYFILL_CONTEXTS>;
export const WINDOW = new Set(["window"] as const);
export const WINDOW_WORKER = new Set(["window", "worker"] as const);
export const ALL = new Set(["window", "worker", "node"] as const);
