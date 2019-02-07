import {stringTuple} from "../util/type/string-tuple";
import {ElementOf} from "../util/type/element-of";

export const POLYFILL_CONTEXTS = stringTuple("node", "window", "worker");

export type PolyfillContext = ElementOf<typeof POLYFILL_CONTEXTS>;

export const NODE_CONTEXT: Set<PolyfillContext> = new Set(stringTuple("node"));
export const WINDOW_CONTEXT: Set<PolyfillContext> = new Set(stringTuple("window"));
export const WORKER_CONTEXT: Set<PolyfillContext> = new Set(stringTuple("worker"));

export const WINDOW_NODE_CONTEXT: Set<PolyfillContext> = new Set([...WINDOW_CONTEXT, ...NODE_CONTEXT]);

export const WINDOW_WORKER_CONTEXT: Set<PolyfillContext> = new Set([...WINDOW_CONTEXT, ...WORKER_CONTEXT]);

export const ALL_CONTEXTS: Set<PolyfillContext> = new Set([...NODE_CONTEXT, ...WINDOW_WORKER_CONTEXT]);
