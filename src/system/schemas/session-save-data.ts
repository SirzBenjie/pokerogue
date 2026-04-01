/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Z$ArenaData } from "#system/schemas/arena/arena-data";
import { Z$BattleType } from "#system/schemas/battle-type";
import { Z$ChallengeData } from "#system/schemas/challenge-data";
import { Z$NonNegativeInt, Z$PositiveInt } from "#system/schemas/common";
import { Z$TrainerData } from "#system/schemas/game/trainer-data";
import { Z$GameModes } from "#system/schemas/game-mode";
import { Z$PokeballType } from "#system/schemas/pokeball-type";
import { Z$PokemonData } from "#system/schemas/pokemon/pokemon-data";
import type { SessionSaveData } from "#types/save-data";
import { z } from "zod";
import { Z$MysteryEncounterSaveData } from "./mystery-encounters/mystery-encounter";
import { Z$MysteryEncounterType } from "./mystery-encounters/mystery-encounter-type";

/**
 * Zod schema for {@linkcode SessionSaveData} as of version 1.10
 */
export const Z$SessionSaveData = z.looseObject({
  seed: z.string(),
  playTime: z.number(),
  gameMode: Z$GameModes,
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
  name: z.string().catch(""),
  timestamp: Z$NonNegativeInt,
  challenges: Z$ChallengeData.array(),
  mysteryEncounterType: Z$MysteryEncounterType.or(z.literal(-1)).catch(-1),
  mysteryEncounterSaveData: Z$MysteryEncounterSaveData.optional().catch(undefined),
  playerFaints: Z$NonNegativeInt.catch(0),
});

export type ParsedSessionSaveData = z.output<typeof Z$SessionSaveData>;
