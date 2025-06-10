import { assertEquals, assertRejects } from "@std/assert";
import * as fns from "./_fixtures/functions.ts";
import type { Person } from "./_fixtures/types.ts";
import { validated } from "./compat.ts";
import { SchemaError } from "./schema-error.ts";

Deno.test("validated function with valid payload", async () => {
  const fn = validated(fns.helloValidated);

  const person: Person = { name: "Dave" };

  const result = await fn({ payload: person, context: {} });

  assertEquals(result, { message: "Hello Dave" });
});

Deno.test("validated function with invalid payload", async () => {
  const fn = validated(fns.helloValidated);

  const person = { name: 123 } as unknown as Person;

  await assertRejects(async () => {
    await fn({ payload: person, context: {} });
  }, SchemaError);
});
