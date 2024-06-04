import { UseFormReturn } from "react-hook-form";
import { Horse } from "../constants";

export enum HorseRaceStatus {
  Finished = "Finished",
  Idle = "Idle",
  Race = "Race",
  Started = "Started",
}

export type HorseRaceForm = UseFormReturn<
  {
    wager: number;
    horse: Horse;
  },
  any,
  undefined
>;
