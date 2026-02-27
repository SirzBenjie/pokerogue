/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Status } from "#data/status-effect";
import { StatusEffect } from "#enums/status-effect";
import { Z$NonNegativeInt, Z$PositiveInt } from "#schemas/common";
import { z } from "zod";

/**
 * Zod schema for the {@linkcode StatusEffect} enum
 *
 * @remarks
 * - `0`: NONE,
 * - `1`: POISON,
 * - `2`: TOXIC,
 * - `3`: PARALYSIS,
 * - `4`: SLEEP,
 * - `5`: FREEZE,
 * - `6`: BURN,
 * - `7`: FAINT
 */
export const Z$StatusEffect = z.literal([0, 1, 2, 3, 4, 5, 6, 7]);

// Note: This does not validate that sleepTurnsRemaining exists when effect is SLEEP.
// This is game logic that should perhaps exist in the constructor.
/**
 * Zod schema for the {@linkcode Status} class
 */
export const StatusSchema = z.object({
  effect: Z$StatusEffect.catch(StatusEffect.NONE),
  toxicTurnCount: Z$NonNegativeInt.catch(0),
  sleepTurnsRemaining: Z$PositiveInt.optional().catch(0),
});
