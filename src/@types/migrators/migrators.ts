// biome-ignore lint/correctness/noUnusedImports: Used in a TSDoc comment
import type { SessionMigrationError } from "#system/schema-migrators/system-migration";
import type { Z$SessionSaveData } from "#system/schemas/session-save-data";
import type { z } from "zod";
/** A tuple representing a semantic version: [major, minor, patch] */
export type VersionTuple = [major: number, minor: number, patch: number];

/**
 * The type of a migrator function. Takes in a data object and its version
 * as input, and returns the migrated data or a partial object to be merged
 */
export type Migrator<In extends object = object, T = In> = (data: object, fromVersion: string) => T;

/**
 * A migrator function; takes a data object and its version as input.
 *
 * @param data - The data to migrate
 * @param version - The version of the data being passed in
 * @returns The migrated data, or a partial object to be merged with the parsed data
 * @throws {SessionMigrationError} if migration fails
 * @remarks
 * If the migrator should apply to the data version, then it should apply the transformation
 * and return the updated data.
 *
 *
 * Applies necessary transformations to preprocess the data so it is ready to be
 * parsed by {@linkcode Z$SessionSaveData}
 */
export type SessionSaveMigrator<In extends object = object> = (
  data: In,
  version: VersionTuple,
) => In | Partial<z.input<typeof Z$SessionSaveData>>;
