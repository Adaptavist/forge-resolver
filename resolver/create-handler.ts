import { getSchemas, validate } from "./schemas.ts";
import type { FunctionsModule, Handler } from "./types.ts";

/**
 * Create a forge resolver handler from a module of resolver functions
 * does what '@forge/resolver' does but with a simpler API, without
 * unnecessary classes.
 *
 * BUT, in addition it will also validate payloads and results if the
 * invoked function has standard schemas attached.
 */
export function createHandler(fns: FunctionsModule): Handler {
  return async (
    { call: { functionKey, payload = {}, jobId }, context },
    backendRuntimePayload,
  ) => {
    const fn = fns[functionKey];

    const schemas = getSchemas(fn);

    if (schemas) {
      payload = await validate(payload, schemas.payloadSchema);
    }

    let result = await fn?.({
      payload,
      context: {
        ...context,
        installContext: backendRuntimePayload?.installContext,
        accountId: backendRuntimePayload?.principal?.accountId,
        license: backendRuntimePayload?.license,
        jobId: jobId,
        installation: backendRuntimePayload?.installation,
      },
    });

    if (schemas) {
      result = await validate(result, schemas.resultSchema);
    }

    return result;
  };
}
