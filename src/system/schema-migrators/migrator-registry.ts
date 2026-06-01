import type { SessionSaveMigrator } from "#types/migrators/migrators";
import { z } from "zod";
import { V1_10_IllusionDataMigrator } from "./summon-data";

/**
 * List of all migrators, applied in order
 */
export const SessionMigratorRegistry: SessionSaveMigrator[] = [];
