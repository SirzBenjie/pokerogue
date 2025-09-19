/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { DelayedAttackTag, PositionalTag, WishTag } from "#data/positional-tags/positional-tag";
import { PositionalTagType } from "#enums/positional-tag-type";
import { Z$NonNegativeInt, Z$PositiveInt } from "#system/schemas/common";
import { Z$BattlerIndex } from "#system/schemas/pokemon/battler-index";
import type { NonFunctionProperties } from "#types/type-helpers";
import { z } from "zod";

/**
 * Zod schema for {@linkcode PositionalTagType} as of version 1.10
 */
export const Z$PositionalTagType = z.literal([
  PositionalTagType.DELAYED_ATTACK,
  PositionalTagType.WISH,
]) satisfies z.ZodType<PositionalTagType>;

/**
 * The base shape of a positional tag, consisting of all of the fields other
 * than `tagType`.
 */
const Z$BaseArenaTag = z.object({
  turnCount: z.int(),
  targetIndex: Z$BattlerIndex,
}) satisfies z.ZodType<Omit<NonFunctionProperties<PositionalTag>, "tagType">>;

const Z$DelayedAttackTag = z.object({
  ...Z$BaseArenaTag.shape,
  tagType: z.literal(PositionalTagType.DELAYED_ATTACK),
  sourceId: Z$NonNegativeInt,
  sourceMove: Z$NonNegativeInt,
}) satisfies z.ZodType<NonFunctionProperties<DelayedAttackTag>>;

/** Positional Tag type for the {@linkcode DelayedAttackTag} schema */
export type Z$DelayedAttackTagType = z.infer<typeof Z$DelayedAttackTag>["tagType"];

const Z$WishTag = z.object({
  ...Z$BaseArenaTag.shape,
  tagType: z.literal(PositionalTagType.WISH),
  pokemonName: z.string(),
  healHp: Z$PositiveInt,
}) satisfies z.ZodType<NonFunctionProperties<WishTag>>;
/** Positional Tag type for the {@linkcode WishTag} schema */
export type Z$WishTagType = z.infer<typeof Z$WishTag>["tagType"];

/**
 * Zod schema for an arbitrary {@linkcode PositionalTag} as of version 1.10
 */
export const Z$PositionalTag = z.discriminatedUnion(
  // formatting
  "tagType",
  [Z$WishTag, Z$DelayedAttackTag],
) satisfies z.ZodType<NonFunctionProperties<PositionalTag>>;
