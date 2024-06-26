import React from "react";
import { MINES_GAME_STATUS, MinesGameResult } from "../types";
import { useMinesGameStateStore } from "../store";

export type MinesGameProps = React.ComponentProps<"div"> & {
  gameResults: MinesGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: MinesGameResult[]) => void;
  onAnimationSkipped?: (result: MinesGameResult[]) => void;
};

export const MinesGame = ({ gameResults, children }: MinesGameProps) => {
  // const { updateMinesGameResults, updateGameStatus } = useMinesGameStateStore();

  // React.useEffect(() => {
  //   if (gameResults.length) {
  //     updateMinesGameResults(gameResults);
  //     updateGameStatus(MINES_GAME_STATUS.IN_PROGRESS);
  //   }
  // }, [gameResults]);

  return <>{children}</>;
};
