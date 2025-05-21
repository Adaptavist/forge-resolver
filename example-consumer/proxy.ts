import type { ExampleFns } from "../example-provider/types.ts";
import { resolverProxy } from "../resolver/invoke.ts";

export const exampleProxy = resolverProxy<ExampleFns>();
