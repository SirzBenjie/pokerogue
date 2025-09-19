/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { MoveUseMode } from "#enums/move-use-mode";
import { Z$NonNegativeInt, Z$PositiveInt } from "#system/schemas/common";
import { Z$MoveResult } from "#system/schemas/moves/move-result";
import { Z$BattlerIndex } from "#system/schemas/pokemon/battler-index";
import type { TurnMove } from "#types/turn-move";
import { z } from "zod";

/**
 * Zod schema for the {@linkcode MoveUseMode} enum
 */
export const Z$MoveUseMode = z.literal([1, 2, 3, 4, 5, 6]) satisfies z.ZodType<MoveUseMode>;

/**
 * Zod schema for {@linkcode TurnMove} as of version 1.10.
 */
export const Z$TurnMove = z.object({
  move: Z$PositiveInt,
  targets: z.array(Z$BattlerIndex),
  useMode: Z$MoveUseMode,
  result: Z$MoveResult.optional().catch(undefined),
  turn: Z$NonNegativeInt.optional().catch(undefined),
}) satisfies z.ZodType<TurnMove>;
