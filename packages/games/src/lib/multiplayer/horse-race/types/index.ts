import { UseFormReturn } from "react-hook-form";
import { Horse } from "../constants";

export type HorseRaceForm = UseFormReturn<
  {
    wager: number;
    horse: Horse;
  },
  any,
  undefined
>;
