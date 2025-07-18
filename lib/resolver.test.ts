import { assertEquals, assertIsError } from "@std/assert";
import { assertType, type Has, type IsExact } from "@std/testing/types";
import { bindInvoke, invoke } from "@adaptavist/forge-resolver/invoke";
import { resolverProxy } from "@adaptavist/forge-resolver/proxy";
import {
  bridgeErrors,
  mockBridge,
} from "@adaptavist/forge-resolver/mock-bridge";
import { SchemaError } from "@adaptavist/forge-resolver/schema-error";
import { handler } from "./_fixtures/resolver.ts";
import type { ExampleResolver, Greeting, Person } from "./_fixtures/types.ts";
import type {
  ResolverFunctionProxy,
  ResolverFunctionsModule,
  ResolverProxy,
  ResolverRequest,
} from "@adaptavist/forge-resolver/types";

mockBridge(handler);

Deno.test("resolver functions module with payload fn", () => {
  type FunctionsModule = {
    foo: (req: ResolverRequest<{ prop: string }>) => void;
  };

  assertType<Has<FunctionsModule, ResolverFunctionsModule>>(true);
});

Deno.test("resolver functions module with no payload fn", () => {
  type FunctionsModule = {
    foo: () => void;
  };

  assertType<Has<FunctionsModule, ResolverFunctionsModule>>(true);
});

Deno.test("resolver functions module with an invalid fn", () => {
  type FunctionsModule = {
    foo: (meh: string) => void;
  };

  assertType<Has<FunctionsModule, ResolverFunctionsModule>>(false);
});

Deno.test("validate ExampleResolver module", () => {
  assertType<Has<ExampleResolver, ResolverFunctionsModule>>(true);
});

Deno.test("invoke", async () => {
  const person: Person = { name: "Alice" };

  const result = await invoke<ExampleResolver, "hello">("hello", person);

  assertType<IsExact<typeof result, Greeting>>(true);

  assertEquals(result, { message: "Hello Alice" });
});

Deno.test("invoke, no payload", async () => {
  const result = await invoke<ExampleResolver, "nopayload">(
    "nopayload",
    undefined,
  );

  assertType<IsExact<typeof result, string>>(true);

  assertEquals(result, "ok");
});

Deno.test("bindInvoke", async () => {
  const person: Person = { name: "Bob" };

  const hello = bindInvoke<ExampleResolver, "hello">("hello");

  assertType<
    IsExact<typeof hello, ResolverFunctionProxy<ExampleResolver, "hello">>
  >(true);
  assertType<IsExact<Parameters<typeof hello>, [Person]>>(true);
  assertType<IsExact<ReturnType<typeof hello>, Promise<Greeting>>>(true);

  const result = await hello(person);

  assertType<IsExact<typeof result, Greeting>>(true);

  assertEquals(result, { message: "Hello Bob" });
});

Deno.test("bindInvoke, no payload", async () => {
  const nopayload = bindInvoke<ExampleResolver, "nopayload">("nopayload");

  assertType<
    IsExact<
      typeof nopayload,
      ResolverFunctionProxy<ExampleResolver, "nopayload">
    >
  >(true);
  assertType<IsExact<Parameters<typeof nopayload>, []>>(true);
  assertType<IsExact<ReturnType<typeof nopayload>, Promise<string>>>(true);

  const result = await nopayload();

  assertType<IsExact<typeof result, string>>(true);

  assertEquals(result, "ok");
});

Deno.test("proxy", async () => {
  const person: Person = { name: "Carrie" };

  const exampleResolver = resolverProxy<ExampleResolver>();

  assertType<IsExact<typeof exampleResolver, ResolverProxy<ExampleResolver>>>(
    true,
  );
  assertType<
    IsExact<
      typeof exampleResolver.hello,
      ResolverFunctionProxy<ExampleResolver, "hello">
    >
  >(true);
  assertType<IsExact<Parameters<typeof exampleResolver.hello>, [Person]>>(true);
  assertType<
    IsExact<ReturnType<typeof exampleResolver.hello>, Promise<Greeting>>
  >(true);

  const result = await exampleResolver.hello(person);

  assertType<IsExact<typeof result, Greeting>>(true);

  assertEquals(result, { message: "Hello Carrie" });
});

Deno.test("proxy, no payload", async () => {
  const exampleResolver = resolverProxy<ExampleResolver>();

  assertType<IsExact<typeof exampleResolver, ResolverProxy<ExampleResolver>>>(
    true,
  );
  assertType<
    IsExact<
      typeof exampleResolver.nopayload,
      ResolverFunctionProxy<ExampleResolver, "nopayload">
    >
  >(true);
  assertType<IsExact<Parameters<typeof exampleResolver.nopayload>, []>>(true);
  assertType<
    IsExact<ReturnType<typeof exampleResolver.nopayload>, Promise<string>>
  >(true);

  const result = await exampleResolver.nopayload();

  assertEquals(result, "ok");
});

Deno.test("valid payload validation", async () => {
  const person: Person = { name: "Dave" };

  const result = await invoke<ExampleResolver, "helloValidated">(
    "helloValidated",
    person,
  );

  assertEquals(result, { message: "Hello Dave" });
});

Deno.test("invalid payload validation", async () => {
  const person = { name: 123 } as unknown as Person;

  await invoke<ExampleResolver, "helloValidated">("helloValidated", person);

  const error = bridgeErrors.pop();

  assertIsError(error, SchemaError);
});

Deno.test("non-existent resolver function", async () => {
  await invoke("nonExistentFunction", {});

  const error = bridgeErrors.pop();

  assertIsError(
    error,
    TypeError,
    /^Resolver function not found: "nonExistentFunction"/,
  );
});

Deno.test("invalid resolver function", async () => {
  await invoke("notReallyAFunction", {});

  const error = bridgeErrors.pop();

  assertIsError(
    error,
    TypeError,
    /^Resolver member is not a function: "notReallyAFunction"/,
  );
});
