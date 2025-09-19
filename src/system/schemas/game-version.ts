/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { z } from "zod";

/**
 * Zod schema matching a version string
 *
 * @remarks Equivalent to `z.string().regex(/^\d+\.\d+\.\d+$/)`
 */
export const Z$GameVersion = z.string().regex(/^\d+\.\d+\.\d+$/);
