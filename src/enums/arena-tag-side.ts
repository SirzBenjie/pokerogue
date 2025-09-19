import type { Z$ArenaTagSide } from "#schemas/arena-tag";

/**
 * Enum representing the side that an arena tag affects.
 * @privateRemarks
 * If Adding or removing values here, make sure to update {@linkcode Z$ArenaTagSide}
 * If changing the value of the enum, must
 */
export enum ArenaTagSide {
  BOTH,
  PLAYER,
  ENEMY,
}
