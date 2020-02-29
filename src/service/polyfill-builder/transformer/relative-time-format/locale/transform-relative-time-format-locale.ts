import {PluginContext, TransformSourceDescription} from "rollup";
import {CallExpression, Expression, ExpressionStatement, ObjectExpression, Property, Node, AssignmentExpression} from "estree";
import {dirname, join} from "path";
import {readFileSync} from "fs";

/**
 * Transforms RelativeTimeFormat locales
 *
 * @param code
 * @param id
 * @return
 */
export function transformRelativeTimeFormatLocale(this: PluginContext, code: string, id: string): TransformSourceDescription["ast"] | void {
	/**
	 * Visits a CallExpression that is assigned to the value of a Property
	 *
	 * @param expression
	 * @return
	 */
	const visitPropertyValueCallExpression = (expression: CallExpression): Expression => {
		if (expression.callee.type !== "Identifier" || expression.callee.name !== "require") return expression;
		const [firstArgument] = expression.arguments;
		if (firstArgument == null || firstArgument.type !== "Literal") return expression;
		const moduleSpecifier = firstArgument.value as string;
		const normalizedModuleSpecifier = moduleSpecifier.endsWith(".json") ? moduleSpecifier : `${moduleSpecifier}.js`;
		const rawContent = readFileSync(join(dirname(id), normalizedModuleSpecifier)).toString();

		if (normalizedModuleSpecifier.endsWith(".json")) {
			const {
				body: [firstStatement]
			} = this.parse(`(${rawContent})`, {});
			return (firstStatement as ExpressionStatement).expression;
		} else {
			const {
				body: [firstStatement]
			} = this.parse(rawContent, {});

			if (firstStatement.type !== "ExpressionStatement" || firstStatement.expression.type !== "AssignmentExpression") return expression;

			return firstStatement.expression.right;
		}
	};

	/**
	 * Visits a Property
	 *
	 * @param property
	 * @return
	 */
	const visitProperty = (property: Property): Property => ({
		...property,
		value: property.value.type !== "CallExpression" ? property.value : visitPropertyValueCallExpression(property.value)
	});

	/**
	 * Visits an ObjectExpression
	 *
	 * @param expression
	 * @return
	 */
	const visitObjectExpression = (expression: ObjectExpression): ObjectExpression => ({
		...expression,
		properties: expression.properties.map(visitProperty)
	});

	const ast = this.parse(code, {});
	return {
		type: "Program",
		sourceType: "module",
		body: [
			{
				type: "ImportDeclaration",
				specifiers: [
					{
						type: "ImportDefaultSpecifier",
						local: {
							type: "Identifier",
							name: "RelativeTimeFormat"
						}
					}
				],
				source: {
					type: "Literal",
					value: "../../modules/RelativeTimeFormat",
					raw: '"../../modules/RelativeTimeFormat"'
				}
			},
			...ast.body.filter(isTransformableStatementForRelativeTimeFormat).map(statement => ({
				type: "ExpressionStatement",
				expression: {
					type: "CallExpression",
					callee: {
						type: "MemberExpression",
						object: {
							type: "Identifier",
							name: "RelativeTimeFormat"
						},
						property: {
							type: "Identifier",
							name: "addLocale"
						},
						computed: false
					},
					arguments: [visitObjectExpression(statement.expression.right)]
				}
			}))
		]
	} as TransformSourceDescription["ast"];
}

/**
 * Returns true if the given statement is transformable for locale files for RelativeTimeFormat
 *
 * @param statement
 * @return
 */
function isTransformableStatementForRelativeTimeFormat(
	statement: Node
): statement is ExpressionStatement & {expression: AssignmentExpression & {right: ObjectExpression}} {
	return (
		statement.type === "ExpressionStatement" &&
		statement.expression.type === "AssignmentExpression" &&
		statement.expression.right.type === "ObjectExpression"
	);
}
