import type { FunctionsModule, Payload, ResolverRequest } from "./types.ts";

/**
 * Type-safe invoke of a resolver function
 */
export function invoke<M extends FunctionsModule>(
  functionKey: keyof M,
  payload?: Payload<M[typeof functionKey]>,
): Promise<Awaited<ReturnType<M[typeof functionKey]>>> {
  // return forgeInvoke(functionKey as string, payload);
  // deno-lint-ignore no-explicit-any
  return (globalThis as any)?.__bridge?.callBridge?.("invoke", {
    functionKey,
    payload,
  });
}

/**
 * Create a fn to invoke a named resolver function
 */
export function resolverFnProxy<M extends FunctionsModule>(
  functionKey: keyof M,
): (
  payload?: Parameters<M[typeof functionKey]>[0] extends
    ResolverRequest<infer P> ? P
    : never,
) => Promise<Awaited<ReturnType<M[typeof functionKey]>>> {
  return (payload) => invoke(functionKey, payload);
}

/**
 * Create a proxy object for all functions in the resolver
 */
export function resolverProxy<M extends FunctionsModule>(): {
  [K in keyof M]: Parameters<M[K]>[0] extends ResolverRequest<infer P>
    ? (payload?: P) => Promise<Awaited<ReturnType<M[K]>>>
    : never;
} {
  // deno-lint-ignore no-explicit-any
  return new Proxy({} as any, {
    get: (_obj, functionKey) => {
      if (typeof functionKey === "string") {
        return resolverFnProxy<M>(functionKey);
      }
    },
  });
}
