import type { ResolverRequest } from "../resolver/types.ts";
import { setSchemas } from "../resolver/schemas.ts";
import { z } from "npm:zod@^3.25/v4";

// Example with just Typescript types...

interface FooIn {
  id: number;
  name: string;
}
interface FooOut {
  stuff: string;
}

/**
 * An example function, to be registered with the resolver
 */
export function foo({ payload: { name } }: ResolverRequest<FooIn>): FooOut {
  return { stuff: `Hello ${name}` };
}

// Example with validation schemas (using Zod)...

const FooIn2 = z.object({
  id: z.number(),
  name: z.string(),
});

const FooOut2 = z.object({
  stuff: z.string(),
});

type FooIn2 = z.infer<typeof FooIn2>;
type FooOut2 = z.infer<typeof FooOut2>;

// deno-lint-ignore require-await
export async function foo2(req: ResolverRequest<FooIn2>): Promise<FooOut2> {
  return { stuff: `Hello ${req.payload.name}` };
}

setSchemas(foo2, FooIn2, FooOut2);
