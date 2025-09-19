export interface SettingsSaveMigrator {
  version: string;
  migrate: (data: object) => void;
}
