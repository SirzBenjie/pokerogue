import { Z$Nature } from "#system/schemas/pokemon/pokemon-nature";
import type { VersionTuple } from "#types/migrators/migrators";
import { z } from "zod";

function preCustomPokemonDataMigrator(data: { customPokemonData?: object; natureOverride?: number }): void {
  // Value of `-1` indicated no override, so we can ignore it.
  const nature = Z$Nature.safeParse(data.natureOverride);
  if (nature.success) {
    const customPokemonData = data.customPokemonData;
    // If natureOverride is valid, use it
    if (
      customPokemonData == null
      || typeof customPokemonData !== "object"
      || ((customPokemonData as { nature?: number }).nature ?? -1) !== -1
    ) {
      data.customPokemonData = {
        nature: nature.data,
      };
    }
  }
}
type BasicModifier = { className: string; typeId: string; args: any[]; typePregenArgs: any[] };

function playerModifierMigrator(modifiers: BasicModifier[]): void {
  for (const m of modifiers) {
    if (m.className === "PokemonBaseStatModifier") {
      m.className = "BaseStatModifier";
    } else if (m.className === "PokemonResetNegativeStatStageModifier") {
      m.className = "ResetNegativeStatStageModifier";
    } else if (m.className === "TempBattleStatBoosterModifier") {
      const maxBattles = 5;
      // Dire Hit no longer a part of the TempBattleStatBoosterModifierTypeGenerator
      if (m.typeId !== "DIRE_HIT") {
        m.className = "TempStatStageBoosterModifier";
        m.typeId = "TEMP_STAT_STAGE_BOOSTER";

        // Migration from TempBattleStat to Stat
        const newStat = m.typePregenArgs[0] + 1;
        m.typePregenArgs[0] = newStat;

        // From [ stat, battlesLeft ] to [ stat, maxBattles, battleCount ]
        m.args = [newStat, maxBattles, Math.min(m.args[1], maxBattles)];
      } else {
        m.className = "TempCritBoosterModifier";
        m.typePregenArgs = [];

        // From [ stat, battlesLeft ] to [ maxBattles, battleCount ]
        m.args = [maxBattles, Math.min(m.args[1], maxBattles)];
      }
    } else if (m.className === "DoubleBattleChanceBoosterModifier" && m.args.length === 1) {
      let maxBattles: number;
      switch (m.typeId) {
        case "MAX_LURE":
          maxBattles = 30;
          break;
        case "SUPER_LURE":
          maxBattles = 15;
          break;
        default:
          maxBattles = 10;
      }

      // From [ battlesLeft ] to [ maxBattles, battleCount ]
      m.args = [maxBattles, Math.min(m.args[0], maxBattles)];
    }
  }
}

/**
 * Migrate pre-1.0.4 save data to the 1.0.4 format
 * @param data - The raw json data to be migrated. Will be modified in place.
 * @param version - Version of raw data. This function will do nothing if <= 1.0.4
 */
export function toSessionV1_0_4(
  data: any,
  version: VersionTuple,
): asserts data is object & {
  party?: { customPokemonData?: object; natureOverride?: number }[];
  modifiers: BasicModifier[];
  enemyModifiers: BasicModifier[];
} {
  // Skip
  if (version >= [1, 0, 4]) {
    return;
  }
  data.party?.forEach(preCustomPokemonDataMigrator);
  playerModifierMigrator(data.modifiers);

  // Enemy modifiers just need class name change
  for (const m of data.enemyModifiers ?? []) {
    if (m.className === "PokemonBaseStatModifier") {
      m.className = "BaseStatModifier";
    } else if (m.className === "PokemonResetNegativeStatStageModifier") {
      m.className = "ResetNegativeStatStageModifier";
    }
  }
}
