import type { ResolverFunctionsModule, ResolverRequest } from "./types.ts";
import { bindInvoke } from "./invoke.ts";

/**
 * Create a proxy object for all functions in the resolver
 */
export function resolverProxy<M extends ResolverFunctionsModule>(): {
  [K in keyof M]: Parameters<M[K]>[0] extends ResolverRequest<infer P>
    ? (payload?: P) => Promise<Awaited<ReturnType<M[K]>>>
    : never;
} {
  // deno-lint-ignore no-explicit-any
  return new Proxy({} as any, {
    get: (_obj, functionKey) => {
      if (typeof functionKey === "string") {
        return bindInvoke<M>(functionKey);
      }
    },
  });
}
