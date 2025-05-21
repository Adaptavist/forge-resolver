import type { ExampleFns } from "../example-provider/types.ts";
import { invoke, resolverFnProxy, resolverProxy } from "../resolver/invoke.ts";
import { exampleProxy } from "./proxy.ts";

// Directly invoke fn with name and payload..

const _result1 = await invoke<ExampleFns>("foo", { id: 1, name: "mark" });

const _result2 = await invoke<ExampleFns>("foo2", { id: 2, name: "mark" });

// Create a proxy of a fn with a given name, the proxy fn can later be called
// with just the payload...

const foo = resolverFnProxy<ExampleFns>("foo");

const _result3 = await foo({ id: 3, name: "bob" });

// Create a proxy of the entire set of fns...

const proxy = resolverProxy<ExampleFns>();

const _result4 = await proxy.foo({ id: 4, name: "mark" });

// Import a pre-created proxy for sharing between multiple consumer modules...

const _result5 = await exampleProxy.foo({ id: 5, name: "dave" });
