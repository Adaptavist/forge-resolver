import type { ResolverRequest } from "@adaptavist/forge-resolver/types";

// Example with just Typescript types...

export interface Person {
  name: string;
}
export interface Greeting {
  message: string;
}

/**
 * An example function, to be registered with the resolver
 */
export function hello(
  { payload: { name } }: ResolverRequest<Person>,
): Greeting {
  return { message: `Hello ${name}` };
}
