import { Z$PositiveInt } from "#schemas/common";
import z from "zod";

/**
 * List of "player" modifiers as of 1.11:
 * ## Generation-Gimmick enablers
 * - Dynamax Band
 * - Tera Orb
 * - Mega Bracelet
 * ## Charms
 * - Normal/Super/Golden Exp Charm
 * - Ability Charm
 * - Healing Charm
 * - Shiny Charm
 * - Catching Charm
 * ## Temporary battle modifiers
 * - Lures (lure, super lure, and max lure)
 * - X items (atk, def, spa, spd, spe, and accuracy)
 * - Dire Hit
 * ## Other
 * - Map
 * - Candy Jar
 * - IV Scanner
 * - Amulet Coin
 * - Exp All
 * - Golden PokéBall
 * - Golden Bug Net
 * - Berry Pouch
 * - Lock Capsule
 * - Black Sludge
 * ## Discontinued (Meaning no schemas for these)
 * - Exp Balance
 * - Silver Pokeball
 * - The various repels
 */

const Z$CoerceEmptyArray = z.any().transform(() => []);

/**
 * Zod schema for dynamax band modifier
 */
export const Z$GigantamaxAccessModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("DYNAMAX_BAND"),
  className: z.literal("GigantamaxAccessModifier"),
  stackCount: Z$PositiveInt,
  args: Z$CoerceEmptyArray,
});

/**
 * Zod schema for ability charm modifier
 */
export const Z$LevelIncrementBoosterModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("CANDY_JAR"),
  className: z.literal("LevelIncrementBoosterModifier"),
  stackCount: Z$PositiveInt,
  args: Z$CoerceEmptyArray,
});

/**
 * Zod schema for exp all modifier
 */
export const Z$ExpShareModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("EXP_SHARE"),
  className: z.literal("ExpShareModifier"),
  stackCount: Z$PositiveInt,
  // args: always an empty array, but some old saves have it as null, so transform to empty array
  args: Z$CoerceEmptyArray,
});

/**
 * Zod schema for exp charm modifiers
 */
export const Z$ExpBoosterModifier = z.object({
  player: z.boolean(),
  typeId: z.literal(["EXP_CHARM", "SUPER_EXP_CHARM", "GOLDEN_EXP_CHARM"]),
  className: z.literal("ExpBoosterModifier"),
  stackCount: Z$PositiveInt,
  // The first argument is the % increase for the item
  args: z.tuple([Z$PositiveInt]),
});

/**
 * Zod schema for lure modifiers
 */
export const Z$DoubleBattleChanceBoosterModifier = z.object({
  player: z.boolean(),
  typeId: z.literal(["LURE", "SUPER_LURE", "MAX_LURE"]),
  className: z.literal("DoubleBattleChanceBoosterModifier"),
  // The first argument is max duration, second is remaining duration
  args: z.tuple([Z$PositiveInt, Z$PositiveInt]),
  stackCount: Z$PositiveInt,
  // args: always an empty array
});

/**
 * Zod schema for the legal entries to the X item stat boosters (e.g. x accuracy)
 */
export const Z$TempStatBoosterModifierStatId = z.literal([
  1, // atk
  2, // def
  3, // spa
  4, // spd
  5, // spe
  6, // accuracy
]);

/**
 * Zod schema for the x item modifiers as of version 1.11
 */
export const Z$TempStatStageBoosterModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("TEMP_STAT_STAGE_BOOSTER"),
  className: z.literal("TempStatStageBoosterModifier"),
  stackCount: Z$PositiveInt,
  // Should match args[0]
  typePregenArgs: z.tuple([Z$TempStatBoosterModifierStatId]),
  args: z.tuple([
    Z$TempStatBoosterModifierStatId, // Stat that is boosted
    Z$PositiveInt, // Maximum duration
    Z$PositiveInt, // Remaining Duration
  ]), // stat name, e.g. "atk"
});

/**
 * Zod schema for dire hit modifier as of version 1.11
 */
export const Z$TempCritBoosterModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("TEMP_CRIT_BOOSTER"),
  className: z.literal("TempCritBoosterModifier"),
  stackCount: Z$PositiveInt,
  // The first argument is the crit stage increase
  args: z.tuple([Z$PositiveInt, Z$PositiveInt]), // Max duration, remaining duration
});

/**
 * Zod schema for the golden pokeball modifier as of version 1.11
 */
export const Z$ExtraModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("GOLDEN_POKEBALL"),
  className: z.literal("ExtraModifierModifier"),
  stackCount: Z$PositiveInt,
  // args: always an empty array
});

/**
 * Zod schema for the IV scanner modifier as of version 1.11
 */
export const Z$IvScannerModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("IV_SCANNER"),
  className: z.literal("IvScannerModifier"),
  stackCount: Z$PositiveInt,
  // args: always an empty array
});

/**
 * Zod schema for healing charm as of version 1.11
 */
export const Z$HealingBoosterModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("HEALING_CHARM"),
  className: z.literal("HealingBoosterModifier"),
  stackCount: Z$PositiveInt,
  args: z.tuple([z.number()]),
});

/**
 * Zod schema for Ability Charm
 */
export const Z$HiddenAbilityRateBoosterModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("ABILITY_CHARM"),
  className: z.literal("HiddenAbilityRateBoosterModifier"),
  stackCount: Z$PositiveInt,
  // args: always an empty array
});

/**
 * Zod schema for the amulet coin modifier
 */
export const Z$MoneyMultiplierModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("AMULET_COIN"),
  className: z.literal("MoneyMultiplierModifier"),
  stackCount: Z$PositiveInt,
  // args: always an empty array
});
