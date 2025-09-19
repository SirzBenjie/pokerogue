import type { SessionSaveMigrator } from "#types/migrators/migrators";

/**
 * List of all migrators, applied in order
 */
export const SessionMigratorRegistry: SessionSaveMigrator[] = [];
