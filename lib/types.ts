// deno-lint-ignore-file no-explicit-any

export type AnyPayload = Record<string, any>;
export type AnyContext = Record<string, any>;
export type AnyResult = Record<string, any> | string | void;

/**
 * The resolver handler that is registered via the forge manifest
 */
export type ResolverHandler = (
  payload: {
    call: {
      functionKey: string;
      payload?: AnyPayload;
      jobId?: string;
    };
    context: AnyContext;
  },
  backendRuntimePayload?: AnyPayload,
) => Promise<AnyResult>;

/**
 * Better type decl for the forge 'Request' with parameterized payload type
 */
export interface ResolverRequest<P extends AnyPayload> {
  payload: Partial<P>;
  context: AnyContext;
}

/**
 * A valid resolver function
 */
export type ResolverFunction =
  | ResolverFunctionWithPayload
  | ResolverFunctionNoPayload;

/**
 * A resolver function that accepts a `ResolverRequest` containing a payload
 */
export type ResolverFunctionWithPayload<P extends AnyPayload = AnyPayload> = (
  payload: ResolverRequest<P>,
) => Promise<AnyResult> | AnyResult;

/**
 * A resolver function that has no parameters (and hence no payload)
 */
export type ResolverFunctionNoPayload = () => Promise<AnyResult> | AnyResult;

/**
 * A module of ResolverFunctions
 */
export type ResolverFunctionsModule = Record<string, ResolverFunction>;

/**
 * Extract the payload from a ResolverFunction
 */
export type Payload<R extends ResolverFunction> = R extends
  ResolverFunctionNoPayload ? undefined
  : R extends ResolverFunctionWithPayload<infer P> ? P
  : never;

/**
 * A function that proxies to a resolver function.
 *
 * This is the function type returned by `bindInvoke` and
 * of all functions within a `resolverProxy` object.
 */
export type ResolverFunctionProxy<
  M extends ResolverFunctionsModule,
  K extends keyof M,
> = M[K] extends ResolverFunctionNoPayload
  ? () => Promise<Awaited<ReturnType<M[K]>>>
  : M[K] extends ResolverFunctionWithPayload<infer P>
    ? (payload: P) => Promise<Awaited<ReturnType<M[K]>>>
  : never;

/**
 * The type returned from `resolverProxy`.
 */
export type ResolverProxy<
  M extends ResolverFunctionsModule,
> = {
  [K in keyof M]: ResolverFunctionProxy<M, K>;
};
