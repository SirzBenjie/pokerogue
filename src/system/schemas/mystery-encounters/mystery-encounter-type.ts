/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileContributor: SirzBenjie
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { z } from "zod";

/**
 * Zod schema for {@linkcode MysteryEncounterType} as of version 1.10
 *
 * @remarks
 * - `0`: Mysterious Challengers
 * - `1`: Mysterious Chest
 * - `2`: Dark Deal
 * - `3`: Fight or Flight
 * - `4`: Slumbering Snorlax
 * - `5`: Training Session
 * - `6`: Department Store Sale
 * - `7`: Shady Vitamin Dealer
 * - `8`: Field Trip
 * - `9`: Safari Zone
 * - `10`: Lost at Sea
 * - `11`: Fiery Fallout
 * - `12`: The Strong Stuff
 * - `13`: The Pokémon Salesman
 * - `14`: An Offer You Can't Refuse
 * - `15`: Delibirdy
 * - `16`: Absolute Avarice
 * - `17`: A Trainer's Test
 * - `18`: Trash to Treasure
 * - `19`: Berries Abound
 * - `20`: Clowning Around
 * - `21`: Part Timer
 * - `22`: Dancing Lessons
 * - `23`: Weird Dream
 * - `24`: The Winstrate Challenge
 * - `25`: Teleporting Hijinks
 * - `26`: Bug-Type Superfan
 * - `27`: Fun and Games
 * - `28`: Uncommon Breed
 * - `29`: Global Trade System
 * - `30`: The Expert Pokémon Breeder
 */
export const Z$MysteryEncounterType = z.literal([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
]) satisfies z.ZodType<MysteryEncounterType>;
