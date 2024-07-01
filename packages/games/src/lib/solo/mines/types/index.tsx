import { UseFormReturn } from "react-hook-form";

export interface MinesFormField {
  wager: number;
  minesCount: number;
  selectedCells: boolean[];
}

export type MinesForm = UseFormReturn<MinesFormField, any, undefined>;

export enum MINES_GAME_STATUS {
  IDLE = "IDLE",
  IN_PROGRESS = "STARTED",
  ENDED = "ENDED",
}

export enum MINES_SUBMIT_TYPE {
  IDLE = "IDLE",
  FIRST_REVEAL = "FIRST_REVEAL",
  REVEAL = "REVEAL",
  CASHOUT = "CASHOUT",
  REVEAL_AND_CASHOUT = "REVEAL_AND_CASHOUT",
  FIRST_REVEAL_AND_CASHOUT = "REVEAL_AND_CASHOUT",
}

export interface MinesGameResult {
  minesCells: boolean[];
  revealedCells: boolean[];
  wager: number;
  payout: number;
  multiplier: number;
}

export interface FormSetValue {
  key: keyof MinesFormField;
  value: MinesFormField[keyof MinesFormField];
}
