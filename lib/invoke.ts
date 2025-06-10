import type {
  Payload,
  ResolverFunctionProxy,
  ResolverFunctionsModule,
} from "./types.ts";

/**
 * Type-safe invoke of a resolver function.
 *
 * @example
 * ```ts
 *   const result = await invoke<ExampleResolver, "hello">("hello", { name: "Bob" });
 * ```
 */
export function invoke<M extends ResolverFunctionsModule, K extends keyof M>(
  functionKey: K,
  payload: Payload<M[K]>,
): Promise<Awaited<ReturnType<M[K]>>> {
  // deno-lint-ignore no-explicit-any
  return (globalThis as any)?.__bridge?.callBridge?.("invoke", {
    functionKey,
    payload,
  });
}

/**
 * Create a fn to invoke a named resolver function.
 *
 * @example
 * ```ts
 *   const hello = bindInvoke<ExampleResolver, "hello">("hello");
 *   const result = await hello({ name: "Bob" });
 * ```
 */
export function bindInvoke<
  M extends ResolverFunctionsModule,
  K extends keyof M,
>(
  functionKey: K,
): ResolverFunctionProxy<M, K> {
  // deno-lint-ignore no-explicit-any
  return ((payload: any) => invoke(functionKey as string, payload)) as any;
}
