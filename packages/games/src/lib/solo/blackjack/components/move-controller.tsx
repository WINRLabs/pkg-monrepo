"use client";

import React from "react";

import { cn } from "../../../utils/style";
import { Button } from "../../../ui/button";
import { ActiveGameHands, GameStruct } from "..";
import { useGameOptions } from "../../../game-provider";

export interface MoveControllerProps {
  isDistributionCompleted: boolean;
  isControllerDisabled: boolean;
  activeHandByIndex: ActiveGameHands["firstHand"];
  activeGameData: GameStruct;
  activeHandChipAmount: number | undefined;
  onHit: (handIndex: number) => void;
  onStand: (handIndex: number) => void;
  onDoubleDown: (handIndex: number) => void;
  onSplit: (handIndex: number) => void;
  onInsure: (handIndex: number) => void;
}

export const MoveController: React.FC<MoveControllerProps> = ({
  isDistributionCompleted,
  isControllerDisabled,
  activeHandByIndex,
  activeGameData,
  activeHandChipAmount,
  onHit,
  onDoubleDown,
  onSplit,
  onStand,
  onInsure,
}) => {
  const { account } = useGameOptions();

  const hasBalanceForMove = (chipAmount: number): boolean => {
    const _b = account?.balance || 0;
    return _b >= chipAmount;
  };

  return (
    <div className="wr-absolute wr-bottom-[15px] wr-left-1/2 wr-z-[6] wr-flex -wr-translate-x-1/2 wr-items-center wr-justify-center wr-gap-2 wr-pt-4 max-lg:wr-bottom-2 max-lg:wr-z-[11]">
      <Button
        size="sm"
        variant="third"
        className="wr-h-[30px] wr-w-[65px] wr-rounded-xl wr-text-[12px]"
        onClick={() => onDoubleDown(activeGameData.activeHandIndex)}
        disabled={
          !isDistributionCompleted ||
          isControllerDisabled ||
          !!((activeHandByIndex.cards?.amountCards || 0) !== 2) ||
          !hasBalanceForMove(activeHandChipAmount || 0)
        }
      >
        Double
      </Button>
      <div className="wr-flex wr-items-center wr-justify-center wr-gap-2">
        <div
          onClick={() => onHit(activeGameData.activeHandIndex)}
          className={cn(
            "wr-flex wr-h-[55px] wr-w-[55px] wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-full wr-bg-green-500 wr-text-center wr-text-[12px] wr-font-semibold wr-transition-all wr-duration-300 hover:wr-bg-green-500",
            {
              "wr-pointer-events-none wr-cursor-default wr-bg-unity-white-5 wr-text-unity-white-50":
                !isDistributionCompleted || isControllerDisabled,
            }
          )}
        >
          Hit
        </div>
        <div
          onClick={() => onStand(activeGameData.activeHandIndex)}
          className={cn(
            "wr-flex wr-h-[55px] wr-w-[55px] wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-full wr-bg-red-600 wr-text-center wr-text-[12px] wr-font-semibold wr-transition-all wr-duration-300 hover:wr-bg-red-700",
            {
              "wr-pointer-events-none wr-cursor-default wr-bg-unity-white-5 wr-text-unity-white-50":
                !isDistributionCompleted || isControllerDisabled,
            }
          )}
        >
          Stand
        </div>
      </div>
      <Button
        size="sm"
        variant="third"
        onClick={() => onSplit(activeGameData.activeHandIndex)}
        className="wr-h-[30px] wr-w-[65px] wr-rounded-xl wr-text-[12px]"
        disabled={
          !activeHandByIndex?.cards?.canSplit ||
          !isDistributionCompleted ||
          isControllerDisabled ||
          activeHandByIndex.hand?.isSplitted
        }
      >
        Split
      </Button>

      {activeGameData.canInsure &&
        isDistributionCompleted &&
        !!((activeHandByIndex.cards?.amountCards || 0) == 2) &&
        !activeHandByIndex.hand?.isInsured && (
          <Button
            variant="third"
            size="sm"
            className="wr-absolute -wr-top-6  wr-left-1/2 wr-h-[30px] -wr-translate-x-1/2 wr-rounded-xl wr-text-[13px]"
            onClick={() => onInsure(activeGameData.activeHandIndex)}
            disabled={
              !isDistributionCompleted ||
              isControllerDisabled ||
              !hasBalanceForMove(activeHandChipAmount || 0 / 2)
            }
          >
            Buy Insurance
          </Button>
        )}
    </div>
  );
};
