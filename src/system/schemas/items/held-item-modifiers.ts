import { Z$NonNegativeInt } from "#schemas/common";
import z from "zod";

/**
 * Zod schema for shell bell
 */
export const Z$HitHealModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("HIT_HEAL"),
  args: z.tuple([Z$NonNegativeInt]),
});

/**
 * Zod schema for soul dew
 */
export const Z$PokemonNatureWeightModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("POKEMON_NATURE_WEIGHT"),
  className: z.literal("PokemonNatureWeightModifier"),
});

/**
 * Zod schema for the attack type booster item enum as of version 1.11
 *
 * @remarks
 * - `0`: Silk Scarf
 * - `1`: Black Belt
 * - `2`: Sharp Beak
 * - `3`: Poison Barb
 * - `4`: Soft Sand
 * - `5`: Hard Stone
 * - `6`: Silver Powder
 * - `7`: Spell Tag
 * - `8`: Metal Coat
 * - `9`: Charcoal
 * - `10`: Mystic Water
 * - `11`: Miracle Seed
 * - `12`: Magnet
 * - `13`: Twisted Spoon
 * - `14`: Never-Melt Ice
 * - `15`: Dragon Fang
 * - `16`: Black Glasses
 * - `17`: Fairy Feather
 */
export const Z$AttackTypeBoosterItem = z.literal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);

export const Z$BerryItem = z.literal([]);

export const Z$AttackTypeBoosterItemModifier = z.object({
  player: z.boolean(),
  typeId: z.literal("ATTACK_TYPE_BOOSTER"),
  className: z.literal("AttackTypeBoosterItemModifier"),
  args: z.tuple([Z$AttackTypeBoosterItem]), // The first argument is the attack type ID
});


export const Z$HeldItemModifier = z.union([
  Z$HitHealModifier,
  Z$PokemonNatureWeightModifier,
  Z$AttackTypeBoosterItemModifier,
  // Add more held item modifiers here as needed
]);

export type ParsedHeldItemModifier = z.output<typeof Z$HeldItemModifier>;
