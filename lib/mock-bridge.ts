// deno-lint-ignore-file no-explicit-any
import type { AnyContext, AnyPayload, ResolverHandler } from "./types.ts";

/**
 * Mock up the global bridge to forward invocations to a given resolver.
 */
export function mockBridge(
  resolver: ResolverHandler,
  context: AnyContext = {},
) {
  (globalThis as any).__bridge ??= {};
  (globalThis as any).__bridge.callBridge ??= async (
    _op: "invoke",
    { functionKey, payload }: { functionKey: string; payload: AnyPayload },
  ) => {
    try {
      return await resolver({
        call: {
          functionKey,
          payload,
        },
        context,
      });
    } catch (e: unknown) {
      bridgeErrors.push(e);
      // TODO: what should we return on error?
    }
  };
}

/**
 * Errors gathered by the bridge during invocation
 */
export const bridgeErrors: unknown[] = [];
