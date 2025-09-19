/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { BattleType } from "#enums/battle-type";
import { z } from "zod";

/**
 * Zod schema for {@linkcode BattleType} as of version 1.10
 *
 * @remarks
 * - `0`: WILD
 * - `1`: TRAINER
 * - `2`: CLEAR
 * - `3`: MYSTERY_ENCOUNTER
 */
export const Z$BattleType = z.literal([0, 1, 2, 3]) satisfies z.ZodType<BattleType>;
