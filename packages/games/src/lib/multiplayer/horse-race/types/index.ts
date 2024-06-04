import { UseFormReturn } from "react-hook-form";
import { Horse } from "../constants";

export interface HorseRaceFormFields {
  wager: number;
  horse: Horse;
}

export type HorseRaceForm = UseFormReturn<HorseRaceFormFields, any, undefined>;
