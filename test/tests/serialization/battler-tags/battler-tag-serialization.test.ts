/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getBattlerTag, SerializableBattlerTag } from "#data/battler-tags";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Z$BattlerTag } from "#system/schemas/pokemon/battler-tag";
import { describe, expect, it } from "vitest";

describe("Serialization - Battler Tags", () => {
  // Serialize and deserialize each arena tag.

  // Collect the arena tags for each arena tag type that is considered serializable.
  describe("Round trip serialization", () => {
    for (const battlerTag of Object.values(BattlerTagType)) {
      // Just use arbitrary data for the required fields.
      const tag = getBattlerTag(battlerTag, 3, MoveId.TACKLE, 1);
      if (!(tag instanceof SerializableBattlerTag)) {
        continue;
      }

      // Now, "serialize" the tag via toJSON and JSON.stringify.
      it(`${battlerTag}`, () => {
        const deserialized = JSON.parse(JSON.stringify(tag));
        // Now, try loading the tag
        const parsed = Z$BattlerTag.parse(deserialized);

        // Now, expect the fields of each tag to be the same.
        expect(parsed).toEqual(tag);
      });
    }
  });
});
