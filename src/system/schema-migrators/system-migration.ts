import { SessionMigratorRegistry as sessionMigratorRegistry } from "#system/schema-migrators/migrator-registry";
import { Z$SessionSaveData } from "#system/schemas/session-save-data";
import type { VersionTuple } from "#types/migrators/migrators";
import { z } from "zod";

/**
 * Error thrown when session migration fails
 */
export class SessionMigrationError extends Error {}

/**
 * Regex that matches against a version number string
 *
 * @internal
 */
const versionRegex = /^(\d+)\.(\d+)\.(\d+)$/;

/**
 * Parse serialized session save data into the SessionSaveData object
 *
 * @param data - The data to parse
 * @returns
 *
 * @throws {SessionMigrationError} if migration fails
 */
export function parseSessionData(data: any): z.output<typeof Z$SessionSaveData> {
  const version = data["gameVersion"];
  const invalidMsg = "Invalid or missing game version in save data";
  if (typeof version !== "string") {
    throw new SessionMigrationError(invalidMsg);
  }

  const versionMatch = version.match(versionRegex);
  if (versionMatch == null) {
    throw new SessionMigrationError(invalidMsg);
  }

  const versionTuple = versionMatch.slice(1).map(Number) as VersionTuple;

  // If an error occurs while applying a migrator, just try to continue forward without stopping
  // the entire migration process.
  for (const migrator of sessionMigratorRegistry) {
    try {
      data = migrator(data, versionTuple);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.warn(err);
      } else {
        throw err;
      }
    }
  }

  try {
    return Z$SessionSaveData.parse(data);
  } catch (err) {
    throw new SessionMigrationError("Failed to parse session save data", { cause: err });
  }
}
