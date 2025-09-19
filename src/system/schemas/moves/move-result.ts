/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { MoveResult } from "#enums/move-result";
import { z } from "zod";

/** * Zod schema for the {@linkcode MoveResult} enum as of version 1.10 */
export const Z$MoveResult = z.literal([0, 1, 2, 3, 4]) satisfies z.ZodType<MoveResult>;
