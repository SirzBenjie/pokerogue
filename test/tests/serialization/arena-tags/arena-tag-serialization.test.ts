/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getArenaTag, SerializableArenaTag } from "#data/arena-tag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { Z$ArenaTag } from "#system/schemas/arena/arena-tag";
import { describe, expect, it } from "vitest";

describe("Serialization - Arena Tags", () => {
  // Serialize and deserialize each arena tag.

  // Collect the arena tags for each arena tag type that is considered serializable.
  describe("Round trip serialization", () => {
    for (const arenaTagType of Object.values(ArenaTagType)) {
      // Just use arbitrary data for the required fields.
      const tag = getArenaTag(arenaTagType, 2, MoveId.TACKLE, 1, ArenaTagSide.PLAYER);
      if (!(tag instanceof SerializableArenaTag)) {
        continue;
      }

      // Now, "serialize" the tag via toJSON and JSON.stringify.
      it(`${arenaTagType}`, () => {
        const deserialized = JSON.parse(JSON.stringify(tag));
        // Now, try loading the tag
        const parsed = Z$ArenaTag.parse(deserialized);

        // Now, expect the fields of each tag to be the same.
        expect(parsed).toEqual(tag);
      });
    }
  });
});
