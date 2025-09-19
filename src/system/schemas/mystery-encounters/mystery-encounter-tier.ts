/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { z } from "zod";

// This should error if a new tier is added without updating this schema
/**
 * Zod schema for {@linkcode MysteryEncounterTier} as of version 1.10
 *
 * @remarks
 * - `0`: Master (not currently used)
 * - `3`: Rogue
 * - `19`: Ultra
 * - `40`: Great
 * - `66`: Common
 */
export const Z$MysteryEncounterTier = z.literal([0, 3, 19, 40, 66]) satisfies z.ZodType<MysteryEncounterTier>;
