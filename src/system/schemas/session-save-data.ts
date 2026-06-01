/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChallengeData } from "#system/challenge-data";
import { ModifierData } from "#system/modifier-data";
import { PokemonData } from "#system/pokemon-data";
import { Z$ArenaData } from "#system/schemas/arena/arena-data";
import { Z$BattleType } from "#system/schemas/battle-type";
import { Z$ChallengeData } from "#system/schemas/challenge-data";
import { Z$NonNegativeInt, Z$PositiveInt } from "#system/schemas/common";
import { Z$TrainerData } from "#system/schemas/game/trainer-data";
import { Z$GameModes } from "#system/schemas/game-mode";
import { Z$PokeballType } from "#system/schemas/pokeball-type";
import { Z$PokemonData } from "#system/schemas/pokemon/pokemon-data";
import { TrainerData } from "#system/trainer-data";
import type { SessionSaveData } from "#types/save-data";
import { z } from "zod";
import { Z$Modifier } from "./items/modifiers";
import { Z$MysteryEncounterSaveData } from "./mystery-encounters/mystery-encounter";
import { Z$MysteryEncounterType } from "./mystery-encounters/mystery-encounter-type";

/**
 * Zod schema for {@linkcode SessionSaveData} as of version 1.10
 */
export const Z$SessionSaveData = z.object({
  seed: z.string(),
  playTime: z.number(),
  gameMode: Z$GameModes,
  party: z.array(Z$PokemonData.transform(p => new PokemonData(p))),
  enemyParty: Z$PokemonData.array(),
  modifiers: z
    .array(
      Z$Modifier.transform(d => new ModifierData(d, true))
        .optional()
        .catch(undefined),
    )
    .transform(arr => arr.filter(m => m != null)),
  enemyModifiers: z
    .array(
      Z$Modifier.transform(d => new ModifierData(d, false))
        .optional()
        .catch(undefined),
    )
    .transform(arr => arr.filter(m => m != null))
    .catch([]),
  arena: Z$ArenaData,
  pokeballCounts: z.record(Z$PokeballType, Z$PositiveInt.catch(0)),
  money: Z$NonNegativeInt.catch(0),
  score: Z$NonNegativeInt.catch(0),
  waveIndex: Z$PositiveInt.catch(1),
  battleType: Z$BattleType,
  trainer: Z$TrainerData.transform(p => new TrainerData(p))
    .optional()
    .catch(undefined),
  gameVersion: z.string(),
  name: z.string().catch(""),
  timestamp: Z$NonNegativeInt,
  challenges: z.array(Z$ChallengeData.transform(c => new ChallengeData(c))).catch([]),
  mysteryEncounterType: Z$MysteryEncounterType.or(z.literal(-1)).catch(-1),
  mysteryEncounterSaveData: Z$MysteryEncounterSaveData.optional().catch(undefined),
  playerFaints: Z$NonNegativeInt.catch(0),
});

export type ParsedSessionSaveData = z.output<typeof Z$SessionSaveData>;
