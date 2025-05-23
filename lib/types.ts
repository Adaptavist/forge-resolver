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
 * A resolver function
 */
export type ResolverFunction = (
  payload: ResolverRequest<AnyPayload>,
) => Promise<AnyResult> | AnyResult;

/**
 * A module of ResolverFunctions
 */
export type ResolverFunctionsModule = Record<string, ResolverFunction>;

/**
 * Extract the payload from a ResolverFunction
 */
export type Payload<R extends ResolverFunction> = Parameters<R>[0] extends
  ResolverRequest<infer P> ? P : never;
