export type ElementOf<IterableType> = IterableType extends (infer ElementType)[]
	? ElementType
	: IterableType extends readonly (infer ReadonlyElementType)[]
	? ReadonlyElementType
	: IterableType extends Set<infer SetElementType>
	? SetElementType
	: never;
