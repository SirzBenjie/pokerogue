/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { GameModes } from "#enums/game-modes";
import { z } from "zod";

/**
 * Zod schema for {@linkcode GameModes} as of version 1.10.
 *
 * @remarks
 * - `0`: Classic
 * - `1`: Endless
 * - `2`: Spliced Endless
 * - `3`: Daily
 * - `4`: Challenge
 */
export const Z$GameModes = z.literal([0, 1, 2, 3, 4]) satisfies z.ZodType<GameModes>;
