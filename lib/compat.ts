/**
 * Provides functions to aid compatibility with `@forge/resolver`
 * during migration to `createResolver`.
 *
 * @module
 */

import type {
  AnyPayload,
  AnyResult,
  ResolverFunction,
  ResolverRequest,
} from "./types.ts";
import { getSchemas } from "./schemas.ts";
import { validate } from "./validate.ts";

/**
 * Wrap a ResolverFunction with schema validation, using the schemas registered via `setSchemas`.
 *
 * This is NOT required when using `createResolver` which will automatically validate if
 * schema are present. The primary use-case for this is whilst migrating from the original
 * `resolver.define`.
 *
 * @example
 * ```ts
 *   import Resolver from '@forge/resolver'
 *   import * as fns from "./my-resolver-functions";
 *
 *   const resolver = new Resolver();
 *
 *   resolver.define("foo", validated(fns.foo));
 *
 *   export const handler = resolver.getDefinitions();
 * ```
 */
export function validated(
  fn: ResolverFunction,
): (req: ResolverRequest<AnyPayload>) => Promise<AnyResult> {
  return async (req) => {
    const schemas = getSchemas(fn);

    if (schemas) {
      const payload = await validate(req.payload, schemas.payloadSchema);
      const result = await fn({ ...req, payload });
      return await validate(result, schemas.resultSchema);
    } else {
      return await fn(req);
    }
  };
}
