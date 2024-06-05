import React from "react";
import useHorseRaceGameStore from "../store";
import { HorseRaceStatus } from "../constants";

export type HorseRaceGameProps = React.ComponentProps<"div"> & {
  gameResults: any[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: any[]) => void;
};

export const HorseRaceGame = ({
  gameResults,
  children,
}: HorseRaceGameProps) => {
  const { updateState, updateHorseRaceGameResults } = useHorseRaceGameStore([
    "updateState",
    "updateHorseRaceGameResults",
  ]);

  React.useEffect(() => {
    if (gameResults.length) {
      updateHorseRaceGameResults(gameResults);
      updateState({ status: HorseRaceStatus.Started });
    }
  }, [gameResults]);

  return <>{children}</>;
};
