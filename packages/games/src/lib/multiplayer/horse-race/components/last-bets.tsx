import React from "react";
import { LastBetsContainer } from "../../../common/last-bets-container";
import { cn } from "../../../utils/style";
import { Horse, horseMultipliers } from "../constants";

export const LastBets: React.FC<{ isFinished: boolean; history: any }> = ({
  isFinished,
  history,
}) => {
  return (
    <LastBetsContainer className="absolute left-1/2 top-5 -translate-x-1/2">
      {history.map(
        ({ horse }: { horse: Horse }, i: React.Key | null | undefined) => (
          <div
            className={cn(
              "flex h-[28px] items-center justify-center rounded-[200px] px-2 py-1.5 font-semibold",
              {
                "bg-white bg-opacity-25":
                  `${horseMultipliers[String(horse) as Horse]}x` === "2x",
                "bg-yellow-600":
                  `${horseMultipliers[String(horse) as Horse]}x` === "3x",
                "bg-blue-600":
                  `${horseMultipliers[String(horse) as Horse]}x` == "8x",
                "bg-green-500":
                  `${horseMultipliers[String(horse) as Horse]}x` === "15x",
                "bg-red-600":
                  `${horseMultipliers[String(horse) as Horse]}x` === "60x",
              }
            )}
            key={i}
          >
            {horseMultipliers[String(horse) as Horse]}x
          </div>
        )
      )}
    </LastBetsContainer>
  );
};
