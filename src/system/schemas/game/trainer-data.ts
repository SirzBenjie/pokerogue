import { TrainerVariant } from "#enums/trainer-variant";
import { Z$NonNegativeInt } from "#system/schemas/common";
import { Z$TrainerType } from "#system/schemas/game/trainer-type";
import { Z$TrainerVariant } from "#system/schemas/game/trainer-variant";
import type { TrainerData } from "#system/trainer-data";
import type { NonFunctionProperties } from "#types/type-helpers";
import { z } from "zod";

/**
 * Zod schema for {@linkcode TrainerData} as of version 1.10
 */
export const Z$TrainerData = z.object({
  trainerType: Z$TrainerType,
  variant: Z$TrainerVariant.catch(TrainerVariant.DEFAULT),
  partyTemplateIndex: Z$NonNegativeInt.catch(0),
  nameKey: z.string(),
  partnerNameKey: z.string().or(z.undefined()).catch(undefined),
}) satisfies z.ZodType<NonFunctionProperties<TrainerData>>;
