import path from "crosspath";
import {sync} from "resolve";
import {FileSystem} from "../file-system/file-system";
import {RequiredValues} from "helpertypes";
import {isExternalModule} from "../../util/util";

export interface ResolveOptions {
	cwd: string;
}

export interface ModuleResolverOptions {
	cwd: string;
	fileSystem: FileSystem;
	pkgKeys?: string[];
	extensions?: string[];
}

export interface ModuleResolvable {
	resolve(p: string, options?: Partial<ResolveOptions>): string;
	resolveSafe(p: string, options?: Partial<ResolveOptions>): string | undefined;
}

export class ModuleResolver implements ModuleResolvable {
	readonly options: RequiredValues<ModuleResolverOptions>;
	constructor({
		cwd = path.normalize(process.cwd()),
		pkgKeys = ["module", "es2015", "esm2015", "jsnext:main", "main", "browser"],
		extensions = [".mjs", ".js", ".cjs", ".jsx", ".json"],
		...rest
	}: ModuleResolverOptions) {
		this.options = {
			...rest,
			cwd,
			pkgKeys,
			extensions
		};
	}

	resolveSafe(p: string, options?: Partial<ResolveOptions>): string | undefined {
		try {
			return this.resolve(p, options);
		} catch {
			return undefined;
		}
	}

	resolve(p: string, {cwd = this.options.cwd, ...rest}: Partial<ResolveOptions> = {}): string {
		if (isExternalModule(p)) {
			return this.#resolveExternal(p, {cwd, ...rest});
		}

		return this.#resolveRelative(p, {cwd, ...rest});
	}

	#resolveRelative(p: string, options: ResolveOptions): string {
		const absolute = path.isAbsolute(p) ? p : path.join(options.cwd, p);
		const variants = [absolute, path.join(absolute, "index")];
		for (const variant of variants) {
			for (const ext of ["", ...this.options.extensions]) {
				const withExtension = `${variant}${ext}`;
				if (this.options.fileSystem.isFileSync(withExtension)) {
					return withExtension;
				}
			}
		}
		throw new ReferenceError(`Could not resolve path: ${absolute}`);
	}

	#resolveExternal(p: string, options: ResolveOptions): string {
		return path.normalize(
			sync(p, {
				basedir: options.cwd,
				extensions: this.options.extensions,
				readFileSync: p => this.options.fileSystem.readFileSync(p)?.toString() ?? "",
				isFile: p => this.options.fileSystem.isFileSync(p),
				isDirectory: p => this.options.fileSystem.isDirectorySync(p),
				packageFilter: (pkg: Record<string, string>): Record<string, string> => {
					const packageKeys = Object.keys(pkg);
					const property = this.options.pkgKeys.find(key => packageKeys.includes(key));

					// If a property was resolved, set the 'main' property to it (resolve will use the main property no matter what)
					if (property != null) {
						pkg.main = pkg[property];
					}

					// Return the package
					return pkg;
				}
			})
		);
	}
}
