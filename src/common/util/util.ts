export function isExternalModule(module: string): boolean {
	return !module.startsWith(".") && !module.startsWith("/");
}
