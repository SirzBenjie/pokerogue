import type { PokemonMove } from "#moves/pokemon-move";
import { z } from "zod";

/**
 * Zod schema for {@linkcode PokemonMove}, as of version 1.10.
 */
export const Z$PokemonMove = z.object({
  moveId: z.number().int().min(0), // Move ID, default to 0
  ppUsed: z.number().int().default(0).catch(0), // PP used, default to 0
  ppUp: z.number().int().default(0).catch(0), // PP Up count, default to 0
  maxPpOverride: z.int().min(1).optional(), // Optional max PP override, can be null
}) satisfies z.ZodType<Parameters<(typeof PokemonMove)["loadMove"]>[0]>;
