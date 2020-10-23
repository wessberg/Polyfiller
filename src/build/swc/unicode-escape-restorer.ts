import Visitor from "@swc/core/Visitor";
import {VariableDeclarator} from "@swc/core";

export class UnicodeEscapeRestorer extends Visitor {
	visitVariableDeclarator(n: VariableDeclarator): VariableDeclarator {
		if (n.id.type !== "Identifier") return n;
		if (n.id.value !== "require_whitespaces") return n;
		const expression = (n as any).init.arguments[0].expression.body.stmts[0].expression;
		expression.right = {
			type: "BinaryExpression",
			span: n.span,
			operator: "+",
			left: {
				type: "BinaryExpression",
				span: n.span,
				operator: "+",
				left: {
					type: "BinaryExpression",
					span: n.span,
					operator: "+",
					left: {
						type: "BinaryExpression",
						span: n.span,
						operator: "+",
						left: {
							type: "BinaryExpression",
							span: n.span,
							operator: "+",
							left: {
								type: "BinaryExpression",
								span: n.span,
								operator: "+",
								left: {
									type: "BinaryExpression",
									span: n.span,
									operator: "+",
									left: {
										type: "BinaryExpression",
										span: n.span,
										operator: "+",
										left: {
											type: "BinaryExpression",
											span: n.span,
											operator: "+",
											left: {
												type: "BinaryExpression",
												span: n.span,
												operator: "+",
												left: {
													type: "BinaryExpression",
													span: n.span,
													operator: "+",
													left: {
														type: "BinaryExpression",
														span: n.span,
														operator: "+",
														left: {
															type: "BinaryExpression",
															span: n.span,
															operator: "+",
															left: {
																type: "BinaryExpression",
																span: n.span,
																operator: "+",
																left: {
																	type: "BinaryExpression",
																	span: n.span,
																	operator: "+",
																	left: {
																		type: "BinaryExpression",
																		span: n.span,
																		operator: "+",
																		left: {
																			type: "BinaryExpression",
																			span: n.span,
																			operator: "+",
																			left: {
																				type: "BinaryExpression",
																				span: n.span,
																				operator: "+",
																				left: {
																					type: "BinaryExpression",
																					span: n.span,
																					operator: "+",
																					left: {
																						type: "BinaryExpression",
																						span: n.span,
																						operator: "+",
																						left: {
																							type: "BinaryExpression",
																							span: n.span,
																							operator: "+",
																							left: {
																								type: "BinaryExpression",
																								span: n.span,
																								operator: "+",
																								left: {
																									type: "BinaryExpression",
																									span: n.span,
																									operator: "+",
																									left: {
																										type: "BinaryExpression",
																										span: n.span,
																										operator: "+",
																										left: {
																											type: "CallExpression",
																											span: n.span,
																											callee: {
																												type: "MemberExpression",
																												span: n.span,
																												object: {
																													type: "Identifier",
																													span: n.span,
																													value: "String",
																													typeAnnotation: null,
																													optional: false
																												},
																												property: {
																													type: "Identifier",
																													span: n.span,
																													value: "fromCharCode",
																													typeAnnotation: null,
																													optional: false
																												},
																												computed: false
																											},
																											arguments: [
																												{
																													spread: null,
																													expression: {type: "StringLiteral", span: n.span, value: "0x0009", hasEscape: false}
																												}
																											],
																											typeArguments: null
																										},
																										right: {
																											type: "CallExpression",
																											span: n.span,
																											callee: {
																												type: "MemberExpression",
																												span: n.span,
																												object: {
																													type: "Identifier",
																													span: n.span,
																													value: "String",
																													typeAnnotation: null,
																													optional: false
																												},
																												property: {
																													type: "Identifier",
																													span: n.span,
																													value: "fromCharCode",
																													typeAnnotation: null,
																													optional: false
																												},
																												computed: false
																											},
																											arguments: [
																												{
																													spread: null,
																													expression: {type: "StringLiteral", span: n.span, value: "0x000A", hasEscape: false}
																												}
																											],
																											typeArguments: null
																										}
																									},
																									right: {
																										type: "CallExpression",
																										span: n.span,
																										callee: {
																											type: "MemberExpression",
																											span: n.span,
																											object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																											property: {
																												type: "Identifier",
																												span: n.span,
																												value: "fromCharCode",
																												typeAnnotation: null,
																												optional: false
																											},
																											computed: false
																										},
																										arguments: [
																											{
																												spread: null,
																												expression: {type: "StringLiteral", span: n.span, value: "0x000B", hasEscape: false}
																											}
																										],
																										typeArguments: null
																									}
																								},
																								right: {
																									type: "CallExpression",
																									span: n.span,
																									callee: {
																										type: "MemberExpression",
																										span: n.span,
																										object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																										property: {
																											type: "Identifier",
																											span: n.span,
																											value: "fromCharCode",
																											typeAnnotation: null,
																											optional: false
																										},
																										computed: false
																									},
																									arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x000C", hasEscape: false}}],
																									typeArguments: null
																								}
																							},
																							right: {
																								type: "CallExpression",
																								span: n.span,
																								callee: {
																									type: "MemberExpression",
																									span: n.span,
																									object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																									property: {
																										type: "Identifier",
																										span: n.span,
																										value: "fromCharCode",
																										typeAnnotation: null,
																										optional: false
																									},
																									computed: false
																								},
																								arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x000D", hasEscape: false}}],
																								typeArguments: null
																							}
																						},
																						right: {
																							type: "CallExpression",
																							span: n.span,
																							callee: {
																								type: "MemberExpression",
																								span: n.span,
																								object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																								property: {
																									type: "Identifier",
																									span: n.span,
																									value: "fromCharCode",
																									typeAnnotation: null,
																									optional: false
																								},
																								computed: false
																							},
																							arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x0020", hasEscape: false}}],
																							typeArguments: null
																						}
																					},
																					right: {
																						type: "CallExpression",
																						span: n.span,
																						callee: {
																							type: "MemberExpression",
																							span: n.span,
																							object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																							property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
																							computed: false
																						},
																						arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x00A0", hasEscape: false}}],
																						typeArguments: null
																					}
																				},
																				right: {
																					type: "CallExpression",
																					span: n.span,
																					callee: {
																						type: "MemberExpression",
																						span: n.span,
																						object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																						property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
																						computed: false
																					},
																					arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x1680", hasEscape: false}}],
																					typeArguments: null
																				}
																			},
																			right: {
																				type: "CallExpression",
																				span: n.span,
																				callee: {
																					type: "MemberExpression",
																					span: n.span,
																					object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																					property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
																					computed: false
																				},
																				arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2000", hasEscape: false}}],
																				typeArguments: null
																			}
																		},
																		right: {
																			type: "CallExpression",
																			span: n.span,
																			callee: {
																				type: "MemberExpression",
																				span: n.span,
																				object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																				property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
																				computed: false
																			},
																			arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2001", hasEscape: false}}],
																			typeArguments: null
																		}
																	},
																	right: {
																		type: "CallExpression",
																		span: n.span,
																		callee: {
																			type: "MemberExpression",
																			span: n.span,
																			object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																			property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
																			computed: false
																		},
																		arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2002", hasEscape: false}}],
																		typeArguments: null
																	}
																},
																right: {
																	type: "CallExpression",
																	span: n.span,
																	callee: {
																		type: "MemberExpression",
																		span: n.span,
																		object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																		property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
																		computed: false
																	},
																	arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2003", hasEscape: false}}],
																	typeArguments: null
																}
															},
															right: {
																type: "CallExpression",
																span: n.span,
																callee: {
																	type: "MemberExpression",
																	span: n.span,
																	object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																	property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
																	computed: false
																},
																arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2004", hasEscape: false}}],
																typeArguments: null
															}
														},
														right: {
															type: "CallExpression",
															span: n.span,
															callee: {
																type: "MemberExpression",
																span: n.span,
																object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
																property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
																computed: false
															},
															arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2005", hasEscape: false}}],
															typeArguments: null
														}
													},
													right: {
														type: "CallExpression",
														span: n.span,
														callee: {
															type: "MemberExpression",
															span: n.span,
															object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
															property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
															computed: false
														},
														arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2006", hasEscape: false}}],
														typeArguments: null
													}
												},
												right: {
													type: "CallExpression",
													span: n.span,
													callee: {
														type: "MemberExpression",
														span: n.span,
														object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
														property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
														computed: false
													},
													arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2007", hasEscape: false}}],
													typeArguments: null
												}
											},
											right: {
												type: "CallExpression",
												span: n.span,
												callee: {
													type: "MemberExpression",
													span: n.span,
													object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
													property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
													computed: false
												},
												arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2008", hasEscape: false}}],
												typeArguments: null
											}
										},
										right: {
											type: "CallExpression",
											span: n.span,
											callee: {
												type: "MemberExpression",
												span: n.span,
												object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
												property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
												computed: false
											},
											arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2009", hasEscape: false}}],
											typeArguments: null
										}
									},
									right: {
										type: "CallExpression",
										span: n.span,
										callee: {
											type: "MemberExpression",
											span: n.span,
											object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
											property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
											computed: false
										},
										arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x200A", hasEscape: false}}],
										typeArguments: null
									}
								},
								right: {
									type: "CallExpression",
									span: n.span,
									callee: {
										type: "MemberExpression",
										span: n.span,
										object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
										property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
										computed: false
									},
									arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x202F", hasEscape: false}}],
									typeArguments: null
								}
							},
							right: {
								type: "CallExpression",
								span: n.span,
								callee: {
									type: "MemberExpression",
									span: n.span,
									object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
									property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
									computed: false
								},
								arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x205F", hasEscape: false}}],
								typeArguments: null
							}
						},
						right: {
							type: "CallExpression",
							span: n.span,
							callee: {
								type: "MemberExpression",
								span: n.span,
								object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
								property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
								computed: false
							},
							arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x3000", hasEscape: false}}],
							typeArguments: null
						}
					},
					right: {
						type: "CallExpression",
						span: n.span,
						callee: {
							type: "MemberExpression",
							span: n.span,
							object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
							property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
							computed: false
						},
						arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2028", hasEscape: false}}],
						typeArguments: null
					}
				},
				right: {
					type: "CallExpression",
					span: n.span,
					callee: {
						type: "MemberExpression",
						span: n.span,
						object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
						property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
						computed: false
					},
					arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0x2029", hasEscape: false}}],
					typeArguments: null
				}
			},
			right: {
				type: "CallExpression",
				span: n.span,
				callee: {
					type: "MemberExpression",
					span: n.span,
					object: {type: "Identifier", span: n.span, value: "String", typeAnnotation: null, optional: false},
					property: {type: "Identifier", span: n.span, value: "fromCharCode", typeAnnotation: null, optional: false},
					computed: false
				},
				arguments: [{spread: null, expression: {type: "StringLiteral", span: n.span, value: "0xFEFF", hasEscape: false}}],
				typeArguments: null
			}
		};
		return n;
	}
}
