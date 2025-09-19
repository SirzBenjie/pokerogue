import type {
  MysteryEncounterSaveData,
  QueuedEncounter,
  SeenEncounterData,
} from "#mystery-encounters/mystery-encounter-save-data";
import { Z$NonNegativeInt } from "#system/schemas/common";
import { Z$MysteryEncounterTier } from "#system/schemas/mystery-encounters/mystery-encounter-tier";
import { Z$MysteryEncounterType } from "#system/schemas/mystery-encounters/mystery-encounter-type";
import { z } from "zod";

export const Z$SeenEncounterData = z.object({
  type: Z$MysteryEncounterType,
  tier: Z$MysteryEncounterTier,
  waveIndex: Z$NonNegativeInt,
  selectedOption: Z$NonNegativeInt,
}) satisfies z.ZodType<SeenEncounterData>;

/**
 * Zod schema for {@linkcode QueuedEncounter} as of version 1.10
 */
export const Z$QueuedEncounter = z.object({
  type: z.number(), // MysteryEncounterType
  spawnPercent: z.number(), // Out of 100
}) satisfies z.ZodType<QueuedEncounter>;

/**
 * Zod schema for {@linkcode MysteryEncounterSaveData} as of version 1.10
 */
export const Z$MysteryEncounterSaveData = z.object({
  encounteredEvents: z.array(Z$SeenEncounterData.nullish().catch(undefined)).transform(x => x.filter(y => y != null)),
  encounterSpawnChance: Z$NonNegativeInt,
  queuedEncounters: Z$QueuedEncounter.array(),
}) satisfies z.ZodType<MysteryEncounterSaveData>;
