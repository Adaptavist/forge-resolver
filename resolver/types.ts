// deno-lint-ignore-file no-explicit-any

export type AnyPayload = Record<string, any>;
export type AnyContext = Record<string, any>;
export type AnyResult = Record<string, any> | string | void;

export interface InvokePayload {
  call: {
    functionKey: string;
    payload?: AnyPayload;
    jobId?: string;
  };
  context: AnyContext;
}

export type Handler = (
  payload: InvokePayload,
  backendRuntimePayload?: AnyPayload,
) => Promise<AnyResult>;

/**
 * Better type decl for the forge 'Request' with parameterized payload type
 */
export interface ResolverRequest<P extends AnyPayload> {
  payload: Partial<P>;
  context: AnyContext;
}

export type ResolverFunction = (
  payload: ResolverRequest<AnyPayload>,
) => Promise<AnyResult> | AnyResult;

/**
 * A module of ResolverFunctions
 */
export type FunctionsModule = Record<string, ResolverFunction>;

/**
 * Extract the payload from a ResolverFunction
 */
export type Payload<R extends ResolverFunction> = Parameters<R>[0] extends
  ResolverRequest<infer P> ? P : never;
