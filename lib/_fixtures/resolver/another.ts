import { setSchemas } from "@adaptavist/forge-resolver/schemas";
import type { ResolverRequest } from "@adaptavist/forge-resolver/types";
import { z } from "npm:zod@^3.25/v4";

const InSchema = z.object({
  id: z.number(),
  data: z.string(),
});

const OutSchema = z.object({
  id: z.number(),
  value: z.string(),
  error: z.string().optional(),
});

type InType = z.infer<typeof InSchema>;
type OutType = z.infer<typeof OutSchema>;

export function another({ payload: { id } }: ResolverRequest<InType>): OutType {
  return { id: id!, value: "ok" };
}

setSchemas(another, InSchema, OutSchema);
