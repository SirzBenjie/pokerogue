/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// biome-ignore-start lint/correctness/noUnusedImports: used in a tsdoc comment
import type { SerializedArenaData } from "#system/arena-data";
import { Z$ArenaTag } from "#system/schemas/arena/arena-tag";
import { Z$PositionalTag } from "#system/schemas/arena/positional-tag";
import { Z$Terrain } from "#system/schemas/arena/terrain";
import { Z$Weather } from "#system/schemas/arena/weather";
// biome-ignore-end lint/correctness/noUnusedImports: end
import { Z$BiomeID } from "#system/schemas/biome-id";
import { Z$NonNegativeInt } from "#system/schemas/common";
import type { ArenaTagData } from "#types/arena-tags";
import { z } from "zod";

/**
 * Zod schema for {@linkcode SerializedArenaData} as of version 1.10
 */
export const Z$ArenaData = z.object({
  biome: Z$BiomeID,
  weather: Z$Weather.nullable().catch(null),
  terrain: Z$Terrain.nullable().catch(null),
  tags: z
    // Bang is benign here, as we filter out the undefineds in the transform anyway; just used to shorten type
    .array(Z$ArenaTag.catch(undefined!))
    // Have to cast here because of the awkward implementation of ArenaTags
    .transform(arr => arr.filter(t => t !== undefined)) as z.ZodType<ArenaTagData[]>,
  positionalTags: z.array(Z$PositionalTag.catch(undefined!)).transform(arr => arr.filter(t => t !== undefined)),
  playerTerasUsed: Z$NonNegativeInt.optional().catch(undefined),
}) satisfies z.ZodType<SerializedArenaData>;
