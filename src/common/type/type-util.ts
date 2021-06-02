export type MaybeArray<T> = T[] | T;
export type UppercaseKeys<T> = {[Key in keyof T as Uppercase<string & Key>]: T[Key]};
export type ElementOf<IterableType> = IterableType extends (infer ElementType)[]
	? ElementType
	: IterableType extends readonly (infer ReadonlyElementType)[]
	? ReadonlyElementType
	: IterableType extends Set<infer SetElementType>
	? SetElementType
	: never;

export type PickKeys<T, U extends T> = T extends U ? T : never;
