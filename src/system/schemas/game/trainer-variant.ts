/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { TrainerType } from "#enums/trainer-type";
import { z } from "zod";

/**
 * Zod schema for {@linkcode TrainerVariant} as of version 1.10
 *
 * @remarks
 * - `0`: DEFAULT
 * - `1`: FEMALE
 * - `2`: DOUBLE
 */
export const Z$TrainerVariant = z.literal([0, 1, 2]) satisfies z.ZodType<TrainerType>;
