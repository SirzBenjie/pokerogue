/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// biome-ignore lint/correctness/noUnusedImports: used in TSDoc
import type { CritBoostTag } from "#data/battler-tags";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Z$NonNegativeInt, Z$PositiveInt } from "#system/schemas/common";
import { Z$BattlerIndex } from "#system/schemas/pokemon/battler-index";
import { Z$Stat } from "#system/schemas/pokemon/pokemon-stats";
import type { BasicBattlerTagType, BattlerTagTypeWithMoveId, HighestStatBoostTagType } from "#types/battler-tags";
import type { DiscriminatedUnionFake } from "#types/schema-helpers";
import { z } from "zod";

/*
Schemas for battler tags are a bit more cumbersome,
as we need to have schemas for each subclass that has a different shape.
*/

/**
 * Zod enum of {@linkcode BattlerTagType}s whose associated `BattlerTag` adds no
 * additional fields that are serialized.
 */
const Z$BasicBattlerTag = /** @__PURE__ */ z.literal([
  BattlerTagType.RECHARGING,
  BattlerTagType.CONFUSED,
  BattlerTagType.INFATUATED,
  BattlerTagType.NIGHTMARE,
  BattlerTagType.FRENZY,
  BattlerTagType.CHARGING,
  BattlerTagType.INGRAIN,
  BattlerTagType.OCTOLOCK,
  BattlerTagType.AQUA_RING,
  BattlerTagType.DROWSY,
  BattlerTagType.TRAPPED,
  BattlerTagType.BIND,
  BattlerTagType.WRAP,
  BattlerTagType.FIRE_SPIN,
  BattlerTagType.WHIRLPOOL,
  BattlerTagType.CLAMP,
  BattlerTagType.SAND_TOMB,
  BattlerTagType.MAGMA_STORM,
  BattlerTagType.SNAP_TRAP,
  BattlerTagType.THUNDER_CAGE,
  BattlerTagType.INFESTATION,
  BattlerTagType.PERISH_SONG,
  BattlerTagType.TRUANT,
  BattlerTagType.SLOW_START,
  BattlerTagType.FLYING,
  BattlerTagType.UNDERGROUND,
  BattlerTagType.UNDERWATER,
  BattlerTagType.HIDDEN,
  BattlerTagType.FIRE_BOOST,
  BattlerTagType.ALWAYS_CRIT,
  BattlerTagType.IGNORE_ACCURACY,
  BattlerTagType.IGNORE_FLYING,
  BattlerTagType.SALT_CURED,
  BattlerTagType.CURSED,
  BattlerTagType.CHARGED,
  BattlerTagType.FLOATING,
  BattlerTagType.MINIMIZED,
  BattlerTagType.DESTINY_BOND,
  BattlerTagType.ICE_FACE,
  BattlerTagType.DISGUISE,
  BattlerTagType.RECEIVE_DOUBLE_DAMAGE,
  BattlerTagType.ALWAYS_GET_HIT,
  BattlerTagType.IGNORE_GHOST,
  BattlerTagType.IGNORE_DARK,
  BattlerTagType.GULP_MISSILE_ARROKUDA,
  BattlerTagType.GULP_MISSILE_PIKACHU,
  BattlerTagType.NO_RETREAT,
  BattlerTagType.UNBURDEN,
  BattlerTagType.THROAT_CHOPPED,
  BattlerTagType.TAR_SHOT,
  BattlerTagType.BURNED_UP,
  BattlerTagType.DOUBLE_SHOCKED,
  BattlerTagType.POWER_TRICK,
  BattlerTagType.HEAL_BLOCK,
  BattlerTagType.TORMENT,
  BattlerTagType.TAUNT,
  BattlerTagType.IMPRISON,
  BattlerTagType.SYRUP_BOMB,
  BattlerTagType.TELEKINESIS,
  BattlerTagType.GRUDGE,
]) satisfies z.ZodType<BasicBattlerTagType>;

/** Tag types for the {@linkcode Z$PlainBattlerTag} schema */
export type Z$PlainBattlerTagType = z.infer<typeof Z$BasicBattlerTag>;

const Z$BaseBattlerTag = /** @__PURE__ */ z.object({
  turnCount: z.int(),
  // Source move can be `none` for tags not applied by move, so allow `0` here.
  sourceMove: Z$NonNegativeInt.optional().catch(undefined),
  sourceId: z.int().optional().catch(undefined),
});

/** Zod schema for the subset of {@linkcode BattlerTagType}s that have a `moveId` field */
const Z$BaseTagWithMoveId = /** @__PURE__ */ z.object({
  ...Z$BaseBattlerTag.shape,
  moveId: Z$NonNegativeInt.optional().catch(MoveId.NONE),
});

/**
 * Zod schema for a basic {@linkcode BattlerTag} (i.e., one that does not have
 * additional fields beyond the base `BattlerTag`).
 */
const Z$PlainBattlerTag = /** @__PURE__ */ z.object({
  ...Z$BaseBattlerTag.shape,
  tagType: Z$BasicBattlerTag,
}) as DiscriminatedUnionFake<BasicBattlerTagType, typeof Z$PlainBattlerTag.shape, "tagType">;

/** Zod schema for {@linkcode CritBoostTag} as of version 1.10 */
const Z$CritBoostTag = z.object({
  ...Z$BaseBattlerTag.shape,
  tagType: z.literal([BattlerTagType.CRIT_BOOST, BattlerTagType.DRAGON_CHEER]),
  critStages: Z$PositiveInt.catch(1),
});

/** Tag types for the {@linkcode Z$CritBoostTag} schema */
export type Z$CritBoostTagType = z.infer<typeof Z$CritBoostTag>["tagType"];

const Z$TagWithMoveIdTagType = /** @__PURE__ */ z.literal([
  BattlerTagType.DISABLED,
  BattlerTagType.GORILLA_TACTICS,
  BattlerTagType.ENCORE,
]) satisfies z.ZodType<BattlerTagTypeWithMoveId>;

/** Tag types for the {@linkcode Z$TagWithMoveId} schema */
export type Z$TagWithMoveIdTagType = z.infer<typeof Z$TagWithMoveIdTagType>;

/** Subset of battler tags that have a moveID field */
const Z$TagWithMoveId = z.object({
  ...Z$BaseTagWithMoveId.shape,
  tagType: Z$TagWithMoveIdTagType,
  moveId: Z$NonNegativeInt.catch(MoveId.NONE),
}) as DiscriminatedUnionFake<BattlerTagTypeWithMoveId, typeof Z$TagWithMoveId.shape, "tagType">;

/** Zod schema for {@linkcode SeedTag} as of version 1.10 */
const Z$SeedTag = /** @__PURE__ */ z.object({
  ...Z$BaseBattlerTag.shape,
  tagType: z.literal(BattlerTagType.SEEDED),
  sourceIndex: Z$BattlerIndex,
});
/** Tag type for the {@linkcode Z$SeedTag} schema */
export type Z$SeedTagType = z.infer<typeof Z$SeedTag>["tagType"];

/** Zod schema for {@linkcode HighestStatBoostTag} as of version 1.10 */
const Z$BaseHighestStatBoostTag = /** @__PURE__ */ z.object({
  ...Z$BaseBattlerTag.shape,
  stat: Z$Stat,
  multiplier: z.number(),
});

/** Tag types for the {@linkcode Z$HighestStatBoostTag} schema */
const Z$HighestStatBoostTagType = /** @__PURE__ */ z.literal([
  BattlerTagType.QUARK_DRIVE,
  BattlerTagType.PROTOSYNTHESIS,
]) satisfies z.ZodType<HighestStatBoostTagType>;
/** Tag types for the {@linkcode Z$HighestStatBoostTag} schema */
export type Z$HighestStatBoostTagType = z.infer<typeof Z$HighestStatBoostTagType>;

/** Zod schema for {@linkcode HighestStatBoostTag} as of version 1.10 */
const Z$HighestStatBoostTag = /** @__PURE__ */ z.object({
  ...Z$BaseHighestStatBoostTag.shape,
  tagType: Z$HighestStatBoostTagType,
}) as DiscriminatedUnionFake<HighestStatBoostTagType, typeof Z$HighestStatBoostTag.shape, "tagType">;

/** Zod schema for {@linkcode CommandedTag} as of version 1.10 */
const Z$CommandedTag = z.object({
  ...Z$BaseBattlerTag.shape,
  tagType: z.literal(BattlerTagType.COMMANDED),
  tatsugiriFormKey: z.string().catch("curly"),
});

/** Tag type for the {@linkcode Z$CommandedTag} schema */
export type Z$CommandedTagType = z.infer<typeof Z$CommandedTag>["tagType"];

/** Zod schema for {@linkcode StockpilingTag} as of version 1.10 */
const Z$StockpilingTag = /** @__PURE__ */ z.object({
  ...Z$BaseBattlerTag.shape,
  tagType: z.literal(BattlerTagType.STOCKPILING),
  stockpiledCount: Z$NonNegativeInt.catch(1),
  statChangeCounts: z.object({
    [2]: z.int().min(-6).max(6).catch(0), // Defense
    [4]: z.int().min(-6).max(6).catch(0), // Special Defense
  }),
});
/** Tag type for the {@linkcode Z$StockpilingTag} schema */
export type Z$StockpilingTagType = z.infer<typeof Z$StockpilingTag>["tagType"];

/** Zod schema for {@linkcode AutotomizedTag} as of version 1.10 */
const Z$AutotomizedTag = /** @__PURE__ */ z.object({
  ...Z$BaseBattlerTag.shape,
  tagType: z.literal(BattlerTagType.AUTOTOMIZED),
  autotomizeCount: Z$NonNegativeInt.catch(1),
});
/** Tag type for the {@linkcode Z$AutotomizedTag} schema */
export type Z$AutotomizedTagType = z.infer<typeof Z$AutotomizedTag>["tagType"];

const Z$SubstituteTag = /** @__PURE__ */ z.object({
  ...Z$BaseBattlerTag.shape,
  tagType: z.literal(BattlerTagType.SUBSTITUTE),
  // hp: Z$PositiveInt,
});
/** Tag type for the {@linkcode Z$SubstituteTag} schema */
export type Z$SubstituteTagType = z.infer<typeof Z$SubstituteTag>["tagType"];

// Tag order is intentional here, from fewest matching tag types to most

/** Zod schema for an arbitrary {@linkcode BattlerTag} as of version 1.10 */
export const Z$BattlerTag = z.discriminatedUnion("tagType", [
  Z$SubstituteTag,
  Z$AutotomizedTag,
  Z$StockpilingTag,
  Z$CommandedTag,
  Z$CritBoostTag,
  Z$HighestStatBoostTag,
  Z$SeedTag,
  Z$TagWithMoveId,
  Z$PlainBattlerTag,
]);
