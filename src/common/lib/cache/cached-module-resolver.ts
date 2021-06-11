import {CachedWorkerOptions, CacheWorker} from "./cache-worker";
import {ModuleResolvable, ModuleResolver, ResolveOptions} from "../module-resolver/module-resolver";
import {isExternalModule} from "../../util/util";
import path from "crosspath";

export interface CachedModuleResolverOptions extends CachedWorkerOptions {
	moduleResolver: ModuleResolver;
}

const generateCacheKey = (p: string, cwd: string): string => {
	return isExternalModule(p) ? p : path.isAbsolute(p) ? p : path.join(p, cwd);
};

export class CachedModuleResolver extends CacheWorker<CachedModuleResolverOptions> implements ModuleResolvable {
	resolve(p: string, options?: Partial<ResolveOptions>): string {
		return this.work(generateCacheKey(p, options?.cwd ?? this.options.moduleResolver.options.cwd), () => this.options.moduleResolver.resolve(p, options));
	}

	resolveSafe(p: string, options?: Partial<ResolveOptions>): string | undefined {
		return this.work(generateCacheKey(p, options?.cwd ?? this.options.moduleResolver.options.cwd), () => this.options.moduleResolver.resolveSafe(p, options));
	}
}
