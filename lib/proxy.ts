import type {
  ResolverFunctionProxy,
  ResolverFunctionsModule,
} from "./types.ts";
import { bindInvoke } from "./invoke.ts";

/**
 * Create a proxy object for all functions in the resolver.
 *
 * @example
 * ```ts
 *   const exampleResolver = resolverProxy<ExampleResolver>();
 *   const result = await exampleResolver.hello(person);
 * ```
 */
export function resolverProxy<M extends ResolverFunctionsModule>(): {
  [K in keyof M]: ResolverFunctionProxy<M, K>;
} {
  // deno-lint-ignore no-explicit-any
  return new Proxy({} as any, {
    get: (_obj, functionKey) => {
      if (typeof functionKey === "string") {
        return bindInvoke(functionKey);
      }
    },
  });
}
