/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Nature } from "#enums/nature";
import { z } from "zod";

/**
 * Zod schema for a Pokémon's nature, as of version 1.10
 * - `0`: Hardy,
 * - `1`: Lonely,
 * - `2`: Brave,
 * - `3`: Adamant,
 * - `4`: Naughty,
 * - `5`: Bold,
 * - `6`: Docile,
 * - `7`: Relaxed,
 * - `8`: Impish,
 * - `9`: Lax,
 * - `10`: Timid,
 * - `11`: Hasty,
 * - `12`: Serious,
 * - `13`: Jolly,
 * - `14`: Naive,
 * - `15`: Modest,
 * - `16`: Mild,
 * - `17`: Quiet,
 * - `18`: Bashful,
 * - `19`: Rash,
 * - `20`: Calm,
 * - `21`: Gentle,
 * - `22`: Sassy,
 * - `23`: Careful,
 * - `24`: Quirky
 */
export const Z$Nature = z.literal([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
]) satisfies z.ZodType<Nature>;
