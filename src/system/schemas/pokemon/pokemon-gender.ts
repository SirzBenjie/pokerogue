/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Gender } from "#data/gender";
import { z } from "zod";

/**
 * Schema for a {@linkcode Gender}, as of version 1.10
 *
 * @remarks
 * - `-1`: Genderless,
 * - `0`: Male,
 * - `1`: Female
 */
export const Z$Gender = z.literal([-1, 0, 1]) satisfies z.ZodType<Gender>;
