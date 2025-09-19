/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { PokemonMove } from "#moves/pokemon-move";
import { Z$NonNegativeInt, Z$PositiveInt } from "#system/schemas/common";
import { z } from "zod";

/** Zod schema for {@linkcode PokemonMove}, as of version 1.10 */
export const Z$PokemonMove = z.object({
  moveId: Z$NonNegativeInt.catch(0), // Move ID, default to 0
  ppUsed: z.number().int().default(0).catch(0), // PP used, default to 0
  ppUp: z.number().int().default(0).catch(0), // PP Up count, default to 0
  maxPpOverride: Z$PositiveInt.optional(), // Optional max PP override, can be null
}) satisfies z.ZodType<Parameters<(typeof PokemonMove)["loadMove"]>[0]>;
