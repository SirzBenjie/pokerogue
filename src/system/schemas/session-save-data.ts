import type { SessionSaveData } from "#system/game-data";
import { Z$ArenaData } from "#system/schemas/arena/arena-data";
import { Z$BattleType } from "#system/schemas/battle-type";
import { Z$PositiveInt } from "#system/schemas/common";
import { Z$GameMode } from "#system/schemas/game-mode";
import { Z$TrainerData } from "#system/schemas/game/trainer-data";
import { Z$PokeballType } from "#system/schemas/pokeball-type";
import { Z$PokemonData } from "#system/schemas/pokemon/pokemon-data";
import { z } from "zod";

/**
 * Zod schema for {@linkcode SessionSaveData} as of version 1.10
 */
export const Z$SessionSaveData = z.looseObject({
  seed: z.string(),
  playTime: z.number(),
  gameMode: Z$GameMode,
  party: Z$PokemonData.array(),
  enemyParty: Z$PokemonData.array(),
  // modifiers: TODO
  // enemyModifiers: TODO
  arena: Z$ArenaData,
  pokeballCounts: z.record(Z$PokeballType, Z$PositiveInt.catch(0)),
  money: Z$PositiveInt.catch(0),
  score: Z$PositiveInt.catch(0),
  waveIndex: Z$PositiveInt.catch(0),
  battleType: Z$BattleType,
  trainer: Z$TrainerData.optional().catch(undefined),
  gameVersion: z.string(),

  name: z.string().optional().catch(""),
  // TODO: Add schema for these
}) satisfies z.ZodType<Omit<SessionSaveData, "modifiers" | "enemyModifiers">>;
