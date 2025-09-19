import { V1_10_IllusionDataMigrator } from "#system/schema-migrators/summon-data";
import { Z$IllusionData } from "#system/schemas/pokemon/illusion-data";
import { describe, expect, it } from "vitest";
import testData from "./v1.9-v1.10.json";

describe("Deserialize - Illusion Data", () => {
  describe("Migration from v1.9 to v1.10", () => {
    it.each(testData)("$testName", ({ $input, $output }) => {
      const migratedData = V1_10_IllusionDataMigrator($input);
      const parsedData = Z$IllusionData.parse(migratedData);
      expect(parsedData).toEqual($output);
    });
  });
});
