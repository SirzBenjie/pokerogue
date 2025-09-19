import type { SessionSaveData } from "#types/save-data";

export interface SessionSaveMigrator {
  version: string;
  migrate: (data: SessionSaveData) => void;
}
