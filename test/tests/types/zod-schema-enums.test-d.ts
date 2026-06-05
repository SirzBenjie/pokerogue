/*
 * SPDX-Copyright-Text: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { EntryHazardTag, SerializableArenaTag, SuppressAbilitiesTag } from "#data/arena-tag";
import type {
  AutotomizedTag,
  CommandedTag,
  CritBoostTag,
  HighestStatBoostTag,
  SeedTag,
  StockpilingTag,
  SubstituteTag,
} from "#data/battler-tags";
import type { Gender } from "#data/gender";
import type { DelayedAttackTag, WishTag } from "#data/positional-tags/positional-tag";
import type { TerrainType } from "#data/terrain";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { BattleType } from "#enums/battle-type";
import type { BattlerIndex } from "#enums/battler-index";
import type { BerryType } from "#enums/berry-type";
import type { BiomeId } from "#enums/biome-id";
import type { Challenges } from "#enums/challenges";
import type { MoveResult } from "#enums/move-result";
import type { MoveUseMode } from "#enums/move-use-mode";
import type { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import type { MysteryEncounterType } from "#enums/mystery-encounter-type";
import type { Nature } from "#enums/nature";
import type { PokeballType } from "#enums/pokeball";
import type { PokemonType } from "#enums/pokemon-type";
import type { PositionalTagType } from "#enums/positional-tag-type";
import type { Stat } from "#enums/stat";
import type { StatusEffect } from "#enums/status-effect";
import type { TrainerVariant } from "#enums/trainer-variant";
import type { WeatherType } from "#enums/weather-type";
import type {
  Z$ArenaTagSide,
  Z$EntryHazardTagType,
  Z$PendingHealTagType,
  Z$PlainArenaTagType,
  Z$SuppressAbilitiesTagType,
} from "#system/schemas/arena/arena-tag";
import type { Z$DelayedAttackTagType, Z$PositionalTagType, Z$WishTagType } from "#system/schemas/arena/positional-tag";
import type { Z$TerrainType } from "#system/schemas/arena/terrain";
import type { Z$WeatherType } from "#system/schemas/arena/weather";
import type { Z$BattleType } from "#system/schemas/battle-type";
import type { Z$BerryType } from "#system/schemas/berry-type";
import type { Z$BiomeID } from "#system/schemas/biome-id";
import type { Z$Challenges } from "#system/schemas/challenge-data";
import type { Z$TrainerVariant } from "#system/schemas/game/trainer-variant";
import type { Z$MoveResult } from "#system/schemas/moves/move-result";
import type { Z$MoveUseMode } from "#system/schemas/moves/turn-move";
import type { Z$MysteryEncounterTier } from "#system/schemas/mystery-encounters/mystery-encounter-tier";
import type { Z$MysteryEncounterType } from "#system/schemas/mystery-encounters/mystery-encounter-type";
import type { Z$PokeballType } from "#system/schemas/pokeball-type";
import type { Z$BattlerIndex } from "#system/schemas/pokemon/battler-index";
import type {
  Z$AutotomizedTagType,
  Z$CommandedTagType,
  Z$CritBoostTagType,
  Z$HighestStatBoostTagType,
  Z$PlainBattlerTagType,
  Z$SeedTagType,
  Z$StockpilingTagType,
  Z$SubstituteTagType,
  Z$SupremeOverlordTagType,
  Z$TagWithMoveIdTagType,
} from "#system/schemas/pokemon/battler-tag";
import type { Z$Gender } from "#system/schemas/pokemon/pokemon-gender";
import type { Z$Nature } from "#system/schemas/pokemon/pokemon-nature";
import type { Z$Stat } from "#system/schemas/pokemon/pokemon-stats";
import type { Z$PokemonType } from "#system/schemas/pokemon/pokemon-type";
import type { Z$StatusEffect } from "#system/schemas/status-effect";
import type { BasicBattlerTagType, BattlerTagTypeWithMoveId, SerializableBattlerTagType } from "#types/battler-tags";
import { describe, expectTypeOf, test } from "vitest";
import type { z } from "zod";

/**
 * Test suite responsible for ensuring that there are not missing fields
 * for the Zod schemas that correspond to enums.
 *
 * If tests in this module fail, that means that one of the enums will fail to deserialize, and data may be lost.
 * @module
 */

describe("Zod Schemas - No missing Enum values", () => {
  test("ArenaTagSide", () => {
    expectTypeOf<z.infer<typeof Z$ArenaTagSide>>().branded.toEqualTypeOf<ArenaTagSide>();
  });

  test("PokeballType", () => {
    // Luxury ball is not a valid type for catching
    expectTypeOf<z.infer<typeof Z$PokeballType>>().branded.toEqualTypeOf<
      Exclude<PokeballType, PokeballType.LUXURY_BALL>
    >();
  });

  test("TerrainType", () => {
    expectTypeOf<z.infer<typeof Z$TerrainType>>().branded.toEqualTypeOf<TerrainType>();
  });

  test("WeatherType", () => {
    // None is not a valid type for weather
    expectTypeOf<z.infer<typeof Z$WeatherType>>().branded.toEqualTypeOf<WeatherType>();
  });

  describe("ArenaTags", () => {
    test("EntryHazardTag", () => {
      expectTypeOf<Z$EntryHazardTagType>().toEqualTypeOf<EntryHazardTag["tagType"]>();
    });

    test("SuppressAbilitiesTag", () => {
      expectTypeOf<Z$SuppressAbilitiesTagType>().toEqualTypeOf<SuppressAbilitiesTag["tagType"]>();
    });

    test("SerializableArenaTagType", () => {
      type TypesInSchema =
        | Exclude<Z$PlainArenaTagType, ArenaTagType.NONE>
        | Z$EntryHazardTagType
        | Z$SuppressAbilitiesTagType
        | Z$PendingHealTagType;
      type Missing = Exclude<SerializableArenaTag["tagType"], TypesInSchema>;
      expectTypeOf<Missing>().toBeNever();

      type Extra = Exclude<TypesInSchema, SerializableArenaTag["tagType"]>;
      expectTypeOf<Extra>().toBeNever();
    });
  });

  describe("BattlerTags", () => {
    test("BattlerTagTypeWithMoveId", () => {
      expectTypeOf<Z$TagWithMoveIdTagType>().toEqualTypeOf<BattlerTagTypeWithMoveId>();
    });

    test("BasicBattlerTag", () => {
      expectTypeOf<Z$PlainBattlerTagType>().toEqualTypeOf<BasicBattlerTagType>();
    });

    test("CritBoostTag", () => {
      expectTypeOf<Z$CritBoostTagType>().toEqualTypeOf<CritBoostTag["tagType"]>();
    });

    test("SeedTagType", () => {
      expectTypeOf<Z$SeedTagType>().toEqualTypeOf<SeedTag["tagType"]>();
    });

    test("HighestStatBoostTag", () => {
      expectTypeOf<Z$HighestStatBoostTagType>().toEqualTypeOf<HighestStatBoostTag["tagType"]>();
    });

    test("CommandedTag", () => {
      expectTypeOf<Z$CommandedTagType>().toEqualTypeOf<CommandedTag["tagType"]>();
    });

    test("StockpilingTag", () => {
      // StockpilingTag has no enum values, so we just check that the schema exists
      expectTypeOf<Z$StockpilingTagType>().toEqualTypeOf<StockpilingTag["tagType"]>();
    });

    test("AutotomizedTag", () => {
      expectTypeOf<Z$AutotomizedTagType>().toEqualTypeOf<AutotomizedTag["tagType"]>();
    });

    test("SubstituteTag", () => {
      expectTypeOf<Z$SubstituteTagType>().toEqualTypeOf<SubstituteTag["tagType"]>();
    });

    test("SerializableBattlerTagType", () => {
      type TypesInSchema =
        | Z$SupremeOverlordTagType
        | Z$SubstituteTagType
        | Z$AutotomizedTagType
        | Z$StockpilingTagType
        | Z$CommandedTagType
        | Z$CritBoostTagType
        | Z$HighestStatBoostTagType
        | Z$SeedTagType
        | Z$TagWithMoveIdTagType
        | Z$PlainBattlerTagType;
      type Missing = Exclude<SerializableBattlerTagType, TypesInSchema>;
      expectTypeOf<Missing>().toBeNever();

      type Extra = Exclude<TypesInSchema, SerializableBattlerTagType>;
      expectTypeOf<Extra>().toBeNever();
    });
  });

  describe("PositionalTags", () => {
    test("WishTag", () => {
      expectTypeOf<Z$WishTagType>().toEqualTypeOf<WishTag["tagType"]>();
    });

    test("DelayedAttackTag", () => {
      expectTypeOf<Z$DelayedAttackTagType>().toEqualTypeOf<DelayedAttackTag["tagType"]>();
    });

    test("PositionalTag", () => {
      expectTypeOf<z.infer<typeof Z$PositionalTagType>>().toEqualTypeOf<PositionalTagType>();
    });
  });

  test("BiomeId", () => {
    expectTypeOf<z.infer<typeof Z$BiomeID>>().branded.toEqualTypeOf<BiomeId>();
  });

  test("StatusEffect", () => {
    expectTypeOf<z.infer<typeof Z$StatusEffect>>().branded.toEqualTypeOf<StatusEffect>();
  });

  test("MoveUseMode", () => {
    expectTypeOf<z.infer<typeof Z$MoveUseMode>>().branded.toEqualTypeOf<MoveUseMode>();
  });

  test("MoveResult", () => {
    expectTypeOf<z.infer<typeof Z$MoveResult>>().branded.toEqualTypeOf<MoveResult>();
  });

  test("TrainerType", () => {
    // TODO: Fix this once trainerType enum is updated with new values.
    // expectTypeOf<z.infer<typeof Z$TrainerType>>().branded.toEqualTypeOf<TrainerType>();
  });

  test("TrainerVariant", () => {
    // TrainerVariant has no NONE value, so we can just match directly
    expectTypeOf<z.infer<typeof Z$TrainerVariant>>().branded.toEqualTypeOf<TrainerVariant>();
  });

  test("BattleType", () => {
    expectTypeOf<z.infer<typeof Z$BattleType>>().branded.toEqualTypeOf<BattleType>();
  });

  test("BerryType", () => {
    expectTypeOf<z.infer<typeof Z$BerryType>>().branded.toEqualTypeOf<BerryType>();
  });

  test("Challenges", () => {
    expectTypeOf<z.infer<typeof Z$Challenges>>().branded.toEqualTypeOf<Challenges>();
  });

  test("BattlerIndex", () => {
    expectTypeOf<z.infer<typeof Z$BattlerIndex>>().branded.toEqualTypeOf<BattlerIndex>();
  });

  test("Gender", () => {
    expectTypeOf<z.infer<typeof Z$Gender>>().branded.toEqualTypeOf<Gender>();
  });

  test("Nature", () => {
    expectTypeOf<z.infer<typeof Z$Nature>>().branded.toEqualTypeOf<Nature>();
  });

  test("Stat", () => {
    expectTypeOf<z.infer<typeof Z$Stat>>().branded.toEqualTypeOf<Stat>();
  });

  test("PokemonType", () => {
    expectTypeOf<z.infer<typeof Z$PokemonType>>().branded.toEqualTypeOf<PokemonType>();
  });

  test("MysteryEncounterTier", () => {
    expectTypeOf<z.infer<typeof Z$MysteryEncounterTier>>().branded.toEqualTypeOf<MysteryEncounterTier>();
  });

  test("MysteryEncounterType", () => {
    expectTypeOf<z.infer<typeof Z$MysteryEncounterType>>().branded.toEqualTypeOf<MysteryEncounterType>();
  });
});
