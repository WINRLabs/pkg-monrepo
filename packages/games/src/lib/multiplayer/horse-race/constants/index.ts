import { Multiplier } from "../store";

export enum Horse {
  IDLE = "0",
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
}

export const horseMultipliers: Record<Horse, number> = {
  [Horse.IDLE]: 1,
  [Horse.ONE]: 2,
  [Horse.TWO]: 3,
  [Horse.THREE]: 8,
  [Horse.FOUR]: 15,
  [Horse.FIVE]: 60,
};

export enum HorseRaceStatus {
  Finished = "Finished",
  Idle = "Idle",
  Race = "Race",
  Started = "Started",
}

export const participantMapWithStore: Record<Horse, Multiplier> = {
  [Horse.IDLE]: "2x",
  [Horse.ONE]: "2x",
  [Horse.TWO]: "3x",
  [Horse.THREE]: "8x",
  [Horse.FOUR]: "15x",
  [Horse.FIVE]: "60x",
};
