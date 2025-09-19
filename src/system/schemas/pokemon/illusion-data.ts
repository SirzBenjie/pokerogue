/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { SerializedIllusionData } from "#data/pokemon-data";
import { Z$NonNegativeInt, Z$PositiveInt } from "#system/schemas/common";
import { Z$PokeballType } from "#system/schemas/pokeball-type";
import { Z$Gender } from "#system/schemas/pokemon/pokemon-gender";
import { z } from "zod";

/**
 * Zod schema for {@linkcode IllusionData} as of version 1.10
 */
export const Z$IllusionData = z.object({
  name: z.string(),
  nickname: z.string().optional().catch(undefined),
  shiny: z.boolean(),
  variant: z.literal([0, 1, 2]).catch(0),
  species: Z$PositiveInt,
  formIndex: Z$NonNegativeInt.catch(0),
  gender: Z$Gender,
  pokeball: Z$PokeballType,
  fusionSpecies: Z$PositiveInt.optional().catch(undefined),
  fusionFormIndex: Z$NonNegativeInt.optional().catch(undefined),
  fusionShiny: z.boolean().optional().catch(false),
  fusionVariant: z.literal([0, 1, 2]).optional().catch(0),
  fusionGender: Z$Gender.optional().catch(undefined),
  level: Z$PositiveInt.optional().catch(undefined),
}) satisfies z.ZodType<SerializedIllusionData>;
