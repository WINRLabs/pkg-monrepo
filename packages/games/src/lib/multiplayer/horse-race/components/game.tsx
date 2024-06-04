import React from "react";
import useHorseRaceGameStore from "../store";

export type HorseRaceGameProps = React.ComponentProps<"div"> & {
  gameResults: HorseRaceGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: HorseRaceGameResult[]) => void;
};

export const HorseRaceGame = ({
  gameResults,
  children,
}: HorseRaceGameProps) => {
  const { updateHorseRaceGameResults, updateGameStatus } =
    useHorseRaceGameStore(["updateHorseRaceGameResults", "updateGameStatus"]);

  React.useEffect(() => {
    if (gameResults.length) {
      updateHorseRaceGameResults(gameResults);
      updateGameStatus("PLAYING");
    }
  }, [gameResults]);

  return <>{children}</>;
};
