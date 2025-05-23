import type { StandardSchemaV1 } from "@standard-schema/spec";
import { SchemaError } from "./schema-error.ts";

/**
 * Validate a value against a given standard schema, and throw the appropriate error if invalid.
 */
export async function validate<TSchema extends StandardSchemaV1>(
  value: unknown,
  schema?: TSchema,
): Promise<StandardSchemaV1.InferOutput<TSchema>> {
  if (schema) {
    const result = await schema["~standard"].validate(value);
    if (result.issues) {
      throw new SchemaError(result.issues);
    }
    return result.value;
  }
  return value;
}
