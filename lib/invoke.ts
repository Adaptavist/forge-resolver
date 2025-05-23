import type {
  Payload,
  ResolverFunctionsModule,
  ResolverRequest,
} from "./types.ts";

/**
 * Type-safe invoke of a resolver function
 */
export function invoke<M extends ResolverFunctionsModule>(
  functionKey: keyof M,
  payload?: Payload<M[typeof functionKey]>,
): Promise<Awaited<ReturnType<M[typeof functionKey]>>> {
  // deno-lint-ignore no-explicit-any
  return (globalThis as any)?.__bridge?.callBridge?.("invoke", {
    functionKey,
    payload,
  });
}

/**
 * Create a fn to invoke a named resolver function
 */
export function bindInvoke<M extends ResolverFunctionsModule>(
  functionKey: keyof M,
): (
  payload?: Parameters<M[typeof functionKey]>[0] extends
    ResolverRequest<infer P> ? P
    : never,
) => Promise<Awaited<ReturnType<M[typeof functionKey]>>> {
  return (payload) => invoke(functionKey, payload);
}
