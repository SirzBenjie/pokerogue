import type { PokeballType } from "#enums/pokeball";
import { z } from "zod";

/**
 * Schema for {@linkcode PokeballType} that a pokemon can be caught in, as of version 1.10. Excludes Luxury Ball
 * - `0`: POKEBALL,
 * - `1`: GREAT_BALL,
 * - `2`: ULTRA_BALL,
 * - `3`: ROGUE_BALL,
 * - `4`: MASTER_BALL
 */
export const Z$PokeballType = z.literal([0, 1, 2, 3, 4]) satisfies z.ZodType<PokeballType>;
