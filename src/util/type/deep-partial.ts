/**
 * Make all properties in T deep-optional
 */
export type DeepPartial<T> = {[P in keyof T]?: DeepPartial<T[P]>};
