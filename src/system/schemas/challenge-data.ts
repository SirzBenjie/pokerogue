/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Challenges } from "#enums/challenges";
import type { ChallengeData } from "#system/challenge-data";
import { Z$NonNegativeInt } from "#system/schemas/common";
import { z } from "zod";

/**
 * Zod schema for {@linkcode Challenges} as of version 1.10
 *
 * @remarks
 * - `0`: Single Generation
 * - `1`: Single Type
 * - `2`: Lower Max Starter Cost
 * - `3`: Lower Starter Points
 * - `4`: Fresh Start
 * - `5`: Inverse Battle
 * - `6`: Flip Stat
 * - `7`: Limited Catch
 * - `8`: Limited Support
 * - `9`: Hardcore
 */
export const Z$Challenges = z.literal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) satisfies z.ZodType<Challenges>;

/**
 * Zod schema for {@linkcode ChallengeData} as of version 1.10
 */
export const Z$ChallengeData = z.object({
  id: Z$Challenges,
  value: Z$NonNegativeInt,
  severity: Z$NonNegativeInt,
}) satisfies z.ZodType<Omit<ChallengeData, "toChallenge">>;
