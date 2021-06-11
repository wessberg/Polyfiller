import {ElementOf} from "helpertypes";

export const POLYFILL_CONTEXTS = ["node", "window", "worker"] as const;

export type PolyfillContext = ElementOf<typeof POLYFILL_CONTEXTS>;

export const NODE_CONTEXT: Set<PolyfillContext> = new Set(["node"] as const);
export const WINDOW_CONTEXT: Set<PolyfillContext> = new Set(["window"] as const);
export const WORKER_CONTEXT: Set<PolyfillContext> = new Set(["worker"] as const);

export const WINDOW_NODE_CONTEXT: Set<PolyfillContext> = new Set([...WINDOW_CONTEXT, ...NODE_CONTEXT]);
export const WINDOW_WORKER_CONTEXT: Set<PolyfillContext> = new Set([...WINDOW_CONTEXT, ...WORKER_CONTEXT]);
export const ALL_CONTEXTS: Set<PolyfillContext> = new Set([...NODE_CONTEXT, ...WINDOW_WORKER_CONTEXT]);
