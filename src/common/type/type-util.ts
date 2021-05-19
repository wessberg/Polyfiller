export type MaybeArray<T> = T[] | T;
export type UppercaseKeys<T> = {[Key in keyof T as Uppercase<string & Key>]: T[Key]};
