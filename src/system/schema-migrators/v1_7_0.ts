import { PokemonType } from "#enums/pokemon-type";
import { Z$PositiveInt } from "#system/schemas/common";
import { Z$PokemonType } from "#system/schemas/pokemon/pokemon-type";
import type { VersionTuple } from "#types/migrators/migrators";
import { z } from "zod";

function filterModFunc(
  modifier: { className: string; args: any[] },
  teraTypeMap: Record<number, PokemonType>,
): boolean {
  if (modifier.className !== "TerastallizeModifier") {
    return true;
  }
  teraTypeMap[modifier.args[0]] = modifier.args[1];
  return false;
}

const item = /** __PURE__ */ z.discriminatedUnion("className", [
  z.looseObject({
    className: z.literal("TerastallizeModifier"),
    // Arg 0 is ID, arg1 is tera type
    args: z.tuple([Z$PositiveInt, Z$PokemonType]),
  }),
]);

export function toSessionV1_0_7(
  data: {
    modifiers: Modifier<unknown>[];
    enemyModifiers: Modifier<unknown>[];
    party: { id: number; teraType?: PokemonType }[];
    enemyParty: { id: number; teraType?: PokemonType }[];
  },
  version: VersionTuple,
): void {
  if (version >= [1, 0, 7]) {
    return;
  }

  if (data == null || typeof data !== "object") {
    throw new Error("Invalid save data: expected an object");
  }

  const teraTypeMap: Record<number, PokemonType> = {};

  data.modifiers = data.modifiers.filter((p: any) => filterModFunc(p, teraTypeMap));
  data.enemyModifiers = data.enemyModifiers.filter((p: any) => filterModFunc(p, teraTypeMap));

  for (const pokemon of [...data.party, ...data.enemyParty]) {
    // If tera type is missing, force unknown tera type.
    pokemon.teraType = teraTypeMap[pokemon.id] ?? PokemonType.UNKNOWN;
  }
}
