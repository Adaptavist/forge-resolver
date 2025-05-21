import type { StandardSchemaV1 } from "npm:@standard-schema/spec";
import type {
  AnyPayload,
  AnyResult,
  ResolverFunction,
  ResolverRequest,
} from "./types.ts";

const schemasSymbol = Symbol.for("forge-resolver-fn-schemas");

/**
 * Register payload and result schemas on a resolver function.
 */
export function setSchemas<I extends AnyPayload, O extends AnyResult>(
  fn: (req: ResolverRequest<I>) => Promise<O> | O,
  payloadSchema: StandardSchemaV1<I>,
  resultSchema: StandardSchemaV1<O>,
) {
  (fn as unknown as WithSchemas<I, O>)[schemasSymbol] = {
    payloadSchema,
    resultSchema,
  };
}

/**
 * Get the schemas that were previously registered on a resolver function.
 */
export function getSchemas<F extends ResolverFunction>(
  fn: F,
): Schemas | undefined {
  return (fn as unknown as WithSchemas)[schemasSymbol];
}

/**
 * Validate a value against a given standard schema, and throw the appropriate error if invalid.
 */
export async function validate<V>(
  value: V,
  schema?: StandardSchemaV1<V>,
): Promise<V> {
  if (schema) {
    const result = await schema["~standard"].validate(value);
    if (result.issues) {
      // TODO: better error handling
      throw new Error(JSON.stringify(result.issues, null, 2));
    } else {
      return result.value;
    }
  }
  return value;
}

export interface Schemas<
  I extends AnyPayload = AnyPayload,
  O extends AnyResult = AnyResult,
> {
  payloadSchema: StandardSchemaV1<I>;
  resultSchema: StandardSchemaV1<O>;
}

type WithSchemas<
  I extends AnyPayload = AnyPayload,
  O extends AnyResult = AnyResult,
> = {
  [schemasSymbol]: Schemas<I, O>;
};
