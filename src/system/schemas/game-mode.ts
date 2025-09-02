// biome-ignore lint/correctness/noUnusedImports: Used in tsdoc comment
import type { GameMode } from "#app/game-mode";
import { z } from "zod";

/**
 * Zod schema for {@linkcode GameMode} as of version 1.10.
 *
 * @remarks
 * - `0`: Classic
 * - `1`: Endless
 * - `2`: Spliced Endless
 * - `3`: Daily
 * - `4`: Challenge
 */
export const Z$GameMode = z.literal([0, 1, 2, 3, 4]);
