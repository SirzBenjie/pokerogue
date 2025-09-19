/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { SerializedWeather } from "#data/weather";
// biome-ignore-end lint/correctness/noUnusedImports: used in a tsdoc comment
import { z } from "zod";

/**
 * Zod schema for {@linkcode WeatherType} as of version 1.10.
 *
 * @remarks
 * - `0`: NONE,
 * - `1`: SUNNY,
 * - `2`: RAIN,
 * - `3`: SANDSTORM,
 * - `4`: HAIL,
 * - `5`: SNOW,
 * - `6`: FOG,
 * - `7`: HEAVY_RAIN,
 * - `8`: HARSH_SUN,
 * - `9`: STRONG_WINDS
 */
export const Z$WeatherType = z.literal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

/**
 * Zod schema for {@linkcode SerializedWeather} as of version 1.10.
 */
export const Z$Weather = z.object({
  weatherType: Z$WeatherType,
  turnsLeft: z.int(),
}) satisfies z.ZodType<SerializedWeather>;
