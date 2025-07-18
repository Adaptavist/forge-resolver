import { getSchemas } from "./schemas.ts";
import { validate } from "./validate.ts";
import type { ResolverFunctionsModule, ResolverHandler } from "./types.ts";

/**
 * Create a forge resolver handler from a module of resolver functions
 * does what '@forge/resolver' does but with a simpler API.
 *
 * In addition it will also validate payloads and results if the
 * invoked function has standard schemas attached.
 *
 * @example
 * ```ts
 *   import * as fns from "./my-resolver-functions";
 *
 *   export const handler = createResolver(fns);
 * ```
 */
export function createResolver(fns: ResolverFunctionsModule): ResolverHandler {
  return async (
    { call: { functionKey, payload = {}, jobId }, context },
    backendRuntimePayload,
  ) => {
    const fn = fns[functionKey];

    if (!fn) {
      throw new TypeError(
        `Resolver function not found: "${functionKey}"\n` +
          `Available functions: ${Object.keys(fns).join(", ")}`,
      );
    }

    if (typeof fn !== "function") {
      throw new TypeError(
        `Resolver member is not a function: "${functionKey}"`,
      );
    }

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
