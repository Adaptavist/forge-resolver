import { createResolver } from "@adaptavist/forge-resolver/resolver";
import * as fns from "./functions.ts";

// Minimal amount of boilerplate to provide forge with the resolver handler function...

export const handler = createResolver(fns);
