import { assertEquals, assertIsError } from "@std/assert";
import { bindInvoke, invoke } from "@adaptavist/forge-resolver/invoke";
import { resolverProxy } from "@adaptavist/forge-resolver/proxy";
import {
  bridgeErrors,
  mockBridge,
} from "@adaptavist/forge-resolver/mock-bridge";
import { SchemaError } from "@adaptavist/forge-resolver/schema-error";
import { handler } from "./_fixtures/resolver.ts";
import type { ExampleResolver, Person } from "./_fixtures/types.ts";

mockBridge(handler);

Deno.test("invoke", async () => {
  const person: Person = { name: "Alice" };

  const result = await invoke<ExampleResolver>("hello", person);

  assertEquals(result, { message: "Hello Alice" });
});

Deno.test("bindInvoke", async () => {
  const person: Person = { name: "Bob" };

  const hello = bindInvoke<ExampleResolver>("hello");

  const result = await hello(person);

  assertEquals(result, { message: "Hello Bob" });
});

Deno.test("proxy", async () => {
  const person: Person = { name: "Carrie" };

  const exampleResolver = resolverProxy<ExampleResolver>();

  const result = await exampleResolver.hello(person);

  assertEquals(result, { message: "Hello Carrie" });
});

Deno.test("valid payload validation", async () => {
  const person: Person = { name: "Dave" };

  const result = await invoke<ExampleResolver>("helloValidated", person);

  assertEquals(result, { message: "Hello Dave" });
});

Deno.test("invalid payload validation", async () => {
  const person = { name: 123 } as unknown as Person;

  await invoke<ExampleResolver>("helloValidated", person);

  const error = bridgeErrors.pop();

  assertIsError(error, SchemaError);

  // console.log(error);
});
