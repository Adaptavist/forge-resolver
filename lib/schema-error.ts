import type { StandardSchemaV1 } from "@standard-schema/spec";

// NOTE: This is a copy of https://jsr.io/@standard-schema/utils/0.3.0/src/SchemaError/SchemaError.ts
// but that package currently has a broken import (from npm rather than jsr).

/**
 * A schema error with useful information.
 */
export class SchemaError extends Error {
  /**
   * The schema issues.
   */
  public readonly issues: ReadonlyArray<StandardSchemaV1.Issue>;

  /**
   * Creates a schema error with useful information.
   *
   * @param issues The schema issues.
   */
  constructor(issues: ReadonlyArray<StandardSchemaV1.Issue>) {
    super(issues[0].message);
    this.name = "SchemaError";
    this.issues = issues;
  }
}
