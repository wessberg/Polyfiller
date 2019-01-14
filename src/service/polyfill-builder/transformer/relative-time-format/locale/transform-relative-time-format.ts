import {PluginContext, TransformSourceDescription} from "rollup";
import {AssignmentExpression, CallExpression, ExpressionStatement, Identifier, Literal, MemberExpression, Node, VariableDeclaration, VariableDeclarator} from "estree";

/**
 * Transforms RelativeTimeFormat
 * @param {string} code
 * @return {TransformSourceDescription["ast"]}
 */
export function transformRelativeTimeFormat (this: PluginContext, code: string): TransformSourceDescription["ast"]|void {

	const ast = this.parse(code, {});
	return {
		type: "Program",
		sourceType: "module",
		body: ast.body
			.filter(statement => !isDefineEsModuleOnExportsStatement(statement))
			.map(statement => {
				if (isCommonjsDefaultExport(statement)) {
					return {
						type: "ExportDefaultDeclaration",
						declaration: {
							type: "Identifier",
							name: statement.expression.right.name
						}
					};
				}

				else if (isRequireToVariableAssignment(statement)) {
					return {
						type: "ImportDeclaration",
						specifiers: [
							{
								type: "ImportNamespaceSpecifier",
								local: {
									type: "Identifier",
									name: statement.declarations[0].id.name
								}
							}
						],
						source: {
							type: "Literal",
							value: statement.declarations[0].init.arguments[0].value,
							raw: statement.declarations[0].init.arguments[0].raw
						}
					};
				}

				return statement;
			})
	} as TransformSourceDescription["ast"];
}

/**
 * Returns true if the given statement is an operation such as 'Object.defineProperty(exports, ...)
 * @param {Node} statement
 * @return {boolean}
 */
function isDefineEsModuleOnExportsStatement (statement: Node): statement is ExpressionStatement&{ expression: CallExpression&{ callee: MemberExpression&{ object: Identifier; property: Identifier } } } {
	if (
		statement.type === "ExpressionStatement" &&
		statement.expression.type === "CallExpression" &&
		statement.expression.callee.type === "MemberExpression" &&
		statement.expression.callee.object.type === "Identifier" &&
		statement.expression.callee.object.name === "Object" &&
		statement.expression.callee.property.type === "Identifier" &&
		statement.expression.callee.property.name === "defineProperty"
	) {
		const [firstArgument] = statement.expression.arguments;
		return (
			firstArgument != null &&
			firstArgument.type === "Identifier" &&
			firstArgument.name === "exports"
		);
	}
	return false;
}

/**
 * Returns true if the given statement is an operation such as 'Object.defineProperty(exports, ...)
 * @param {Node} statement
 * @return {boolean}
 */
function isCommonjsDefaultExport (statement: Node): statement is ExpressionStatement&{ expression: AssignmentExpression&{ left: MemberExpression&{ object: Identifier; property: Identifier }; right: Identifier } } {
	return (
		statement.type === "ExpressionStatement" &&
		statement.expression.type === "AssignmentExpression" &&
		statement.expression.left.type === "MemberExpression" &&
		statement.expression.left.object.type === "Identifier" &&
		statement.expression.left.object.name === "exports" &&
		statement.expression.left.property.type === "Identifier" &&
		statement.expression.left.property.name === "default"
	);
}

/**
 * Returns true if the given statement is an operation such as 'const foo = require(...)'
 * @param {Node} statement
 * @return {boolean}
 */
function isRequireToVariableAssignment (statement: Node): statement is VariableDeclaration&{ declarations: [VariableDeclarator&{ id: Identifier; init: CallExpression&{ callee: Identifier; arguments: [Literal] } }] } {
	if (statement.type !== "VariableDeclaration") return false;
	const [firstDeclaration] = statement.declarations;
	if (firstDeclaration == null || firstDeclaration.init == null) return false;
	if (
		firstDeclaration.id.type === "Identifier" &&
		firstDeclaration.init.type === "CallExpression" &&
		firstDeclaration.init.callee.type === "Identifier" &&
		firstDeclaration.init.callee.name === "require"
	) {
		const [firstArgument] = firstDeclaration.init.arguments;
		return (
			firstArgument != null &&
			firstArgument.type === "Literal"
		);
	}
	return false;
}