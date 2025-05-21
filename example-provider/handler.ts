import * as fns from "./functions.ts";
import { createHandler } from "../resolver/create-handler.ts";

// Minimal amount of boilerplate to provide forge with the resolver handler function...

export const handler = createHandler(fns);
