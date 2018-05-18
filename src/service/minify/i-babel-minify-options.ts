export interface IBabelMinifyOptions {
	booleans?: boolean;
	builtIns?: boolean;
	consecutiveAdds?: boolean;
	deadcode?: boolean;
	evaluate?: boolean;
	flipComparisons?: boolean;
	guards?: boolean;
	infinity?: boolean;
	mangle?: boolean;
	memberExpressions?: boolean;
	mergeVars?: boolean;
	numericLiterals?: boolean;
	propertyLiterals?: boolean;
	regexpConstructors?: boolean;
	removeConsole?: boolean;
	removeDebugger?: boolean;
	removeUndefined?: boolean;
	replace?: boolean;
	simplify?: boolean;
	simplifyComparisons?: boolean;
	typeConstructors?: boolean;
	undefinedToVoid?: boolean;
}