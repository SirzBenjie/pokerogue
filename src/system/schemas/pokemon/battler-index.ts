/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { BattlerIndex } from "#enums/battler-index";
import { z } from "zod";

/**
 * Zod schema for the {@linkcode BattlerIndex} as of version 1.10
 *
 * @remarks
 * - `-1`: Attacker
 * - `0`: Player
 * - `1`: Player 2
 * - `2`: Enemy
 * - `3`: Enemy 2
 */
export const Z$BattlerIndex = z.literal([-1, 0, 1, 2, 3]) satisfies z.ZodType<BattlerIndex>;
