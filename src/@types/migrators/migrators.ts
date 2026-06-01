import type { Z$SessionSaveData } from "#system/schemas/session-save-data";
/** A tuple representing a semantic version: [major, minor, patch] */
export type VersionTuple = [major: number, minor: number, patch: number];

/**
 * A migrator function; takes a data object and its version as input.
 *
 * @param data - The data to migrate. Will be modified in place.
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
export type SessionSaveMigrator = (data: any, version: VersionTuple) => any;
