import type { ResolverFunction } from "@adaptavist/forge-resolver/types";

export * from "./resolver/hello.ts";
export * from "./resolver/helloValidated.ts";
export * from "./resolver/another.ts";
export * from "./resolver/nopayload.ts";

export const notReallyAFunction = 123 as unknown as ResolverFunction;
