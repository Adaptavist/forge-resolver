import { setSchemas } from "@adaptavist/forge-resolver/schemas";
import type { ResolverRequest } from "@adaptavist/forge-resolver/types";
import { z } from "npm:zod@^3.25/v4";

const Person = z.object({
  name: z.string(),
});

const Greeting = z.object({
  message: z.string(),
});

type Person = z.infer<typeof Person>;
type Greeting = z.infer<typeof Greeting>;

export function helloValidated(req: ResolverRequest<Person>): Greeting {
  return { message: `Hello ${req.payload.name}` };
}

setSchemas(helloValidated, Person, Greeting);
