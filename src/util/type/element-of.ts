export type ElementOf<ArrayType> = ArrayType extends (infer ElementType)[] ? ElementType : never;
