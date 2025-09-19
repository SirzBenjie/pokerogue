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
import type { TerrainType } from "#data/terrain";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { PokeballType } from "#enums/pokeball";
import type { PositionalTagType } from "#enums/positional-tag-type";
import type { WeatherType } from "#enums/weather-type";
import type {
  Z$ArenaTagSide,
  Z$EntryHazardTagType,
  Z$PlainArenaTagType,
  Z$SuppressAbilitiesTagType,
} from "#system/schemas/arena/arena-tag";
import type { Z$PositionalTagType } from "#system/schemas/arena/positional-tag";
import type { Z$TerrainType } from "#system/schemas/arena/terrain";
import type { Z$WeatherType } from "#system/schemas/arena/weather";
import type { Z$PokeballType } from "#system/schemas/pokeball-type";
import type {
  Z$AutotomizedTagType,
  Z$CommandedTagType,
  Z$CritBoostTagType,
  Z$HighestStatBoostTagType,
  Z$PlainBattlerTagType,
  Z$SeedTagType,
  Z$StockpilingTagType,
  Z$SubstituteTagType,
  Z$TagWithMoveIdTagType,
} from "#system/schemas/pokemon/battler-tag";
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
  test("PositionalTags", () => {
    expectTypeOf<z.input<typeof Z$PositionalTagType>>().toEqualTypeOf<PositionalTagType>();
  });

  test("ArenaTagSide", () => {
    expectTypeOf<z.input<typeof Z$ArenaTagSide>>().branded.toEqualTypeOf<ArenaTagSide>();
  });

  test("PokeballType", () => {
    // Luxury ball is not a valid type for catching
    expectTypeOf<z.input<typeof Z$PokeballType>>().branded.toEqualTypeOf<
      Exclude<PokeballType, PokeballType.LUXURY_BALL>
    >();
  });

  test("TerrainType", () => {
    expectTypeOf<z.input<typeof Z$TerrainType>>().branded.toEqualTypeOf<TerrainType>();
  });

  test("WeatherType", () => {
    // None is not a valid type for weather
    expectTypeOf<z.input<typeof Z$WeatherType>>().branded.toEqualTypeOf<WeatherType>();
  });

  describe("ArenaTag", () => {
    test("EntryHazardTag", () => {
      expectTypeOf<Z$EntryHazardTagType>().toEqualTypeOf<EntryHazardTag["tagType"]>();
    });

    test("SuppressAbilitiesTag", () => {
      expectTypeOf<Z$SuppressAbilitiesTagType>().toEqualTypeOf<SuppressAbilitiesTag["tagType"]>();
    });

    test("SerializableArenaTagType", () => {
      type typesInSchema =
        | Exclude<Z$PlainArenaTagType, ArenaTagType.NONE>
        | Z$EntryHazardTagType
        | Z$SuppressAbilitiesTagType;
      expectTypeOf<typesInSchema>().toEqualTypeOf<SerializableArenaTag["tagType"]>();
    });
  });

  describe("BattlerTag", () => {
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
      type typesInSchema =
        | Z$SubstituteTagType
        | Z$AutotomizedTagType
        | Z$StockpilingTagType
        | Z$CommandedTagType
        | Z$CritBoostTagType
        | Z$HighestStatBoostTagType
        | Z$SeedTagType
        | Z$TagWithMoveIdTagType
        | Z$PlainBattlerTagType;
      // Unlike for arena tags, we can't match on the "tagType" field of SerializableBattlerTag,
      // as some tags are just instances of the class rather than deriving it,
      // and so it does not have a specific "tagType" field.
      expectTypeOf<typesInSchema>().toEqualTypeOf<SerializableBattlerTagType>();
    });
  });
});
