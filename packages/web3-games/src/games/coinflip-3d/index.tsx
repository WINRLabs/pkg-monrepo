"use client";

import {
  COIN_SIDE,
  CoinFlip3DTemplate,
  CoinFlip3dFormFields,
} from "@winrlabs/games";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  useTokenAllowance,
} from "@winrlabs/web3";
import React, { useMemo, useState } from "react";
import { Address, encodeAbiParameters, encodeFunctionData } from "viem";
import {
  DecodedEvent,
  GAME_HUB_EVENT_TYPES,
  SingleStepSettledEvent,
  prepareGameTransaction,
} from "../utils";
import { useGameSocketContext } from "../hooks";

const selectedTokenAddress = (process.env.NEXT_PUBLIC_WETH_ADDRESS ||
  "0x0") as `0x${string}`;
const gameAddress = (process.env.NEXT_PUBLIC_COIN_FLIP_ADDRESS ||
  "0x0") as `0x${string}`;
const controllerAddress = (process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS ||
  "0x0") as `0x${string}`;
const cashierAddress = (process.env.NEXT_PUBLIC_CASHIER_ADDRESS ||
  "0x0") as `0x${string}`;
const uiOperatorAddress = (process.env.NEXT_PUBLIC_UI_OPERATOR_ADDRESS ||
  "0x0") as `0x${string}`;

export default function CoinFlip3DTemplateWithWeb3() {
  const [formValues, setFormValues] = useState<CoinFlip3dFormFields>({
    betCount: 1,
    coinSide: COIN_SIDE.ETH,
    stopGain: 0,
    stopLoss: 0,
    wager: 1,
  });

  const { gameEvent } = useGameSocketContext<any, SingleStepSettledEvent>();

  const [coinFlipResult, setCoinFlipResult] =
    useState<DecodedEvent<any, SingleStepSettledEvent>>();
  const currentAccount = useCurrentAccount();

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x0000000",
    spender: cashierAddress,
    tokenAddress: selectedTokenAddress,
    showDefaultToasts: false,
  });

  const coinFlipSteps = useMemo(() => {
    if (!coinFlipResult) return [];

    return coinFlipResult?.program?.[0]?.data.converted.steps.map((s) => ({
      coinSide: s.outcome.toString() as COIN_SIDE,
      payout: s.payout,
      payoutInUsd: s.payout,
    }));
  }, [coinFlipResult]);

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei, stopGainInWei, stopLossInWei } =
      prepareGameTransaction({
        wager: formValues.wager,
        stopGain: formValues.stopGain,
        stopLoss: formValues.stopLoss,
        selectedCurrency: selectedTokenAddress,
        lastPrice: 1,
      });

    const encodedChoice = encodeAbiParameters(
      [
        {
          name: "data",
          type: "uint8",
        },
      ],
      [Number(formValues.coinSide)]
    );

    const encodedGameData = encodeAbiParameters(
      [
        { name: "wager", type: "uint128" },
        { name: "stopGain", type: "uint128" },
        { name: "stopLoss", type: "uint128" },
        { name: "count", type: "uint8" },
        { name: "data", type: "bytes" },
      ],
      [
        wagerInWei,
        stopGainInWei as bigint,
        stopLossInWei as bigint,
        formValues.betCount,
        encodedChoice,
      ]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddress as Address,
        tokenAddress,
        uiOperatorAddress as Address,
        "bet",
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [
    formValues.betCount,
    formValues.coinSide,
    formValues.stopGain,
    formValues.stopLoss,
    formValues.wager,
  ]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddress as Address,
        encodedParams.tokenAddress,
        uiOperatorAddress as Address,
        "bet",
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedTxData,
  });

  const onGameSubmit = async () => {
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log("error", e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      await handleTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
    }
  };

  React.useEffect(() => {
    const finalResult = gameEvent;

    if (finalResult?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled)
      setCoinFlipResult(finalResult);
  }, [gameEvent]);

  return (
    <CoinFlip3DTemplate
      maxWager={100}
      minWager={1}
      options={{
        scene: {
          loader: "/coin-flip-3d/loader.png",
          logo: "/coin-flip-3d/coin-flip-logo.png",
        },
      }}
      onSubmitGameForm={onGameSubmit}
      onAnimationStep={(e) => {
        console.log("STEP", e);
      }}
      onAnimationCompleted={() => {
        console.log("game completed");
      }}
      gameResults={coinFlipSteps || []}
      onFormChange={(val) => {
        setFormValues(val);
      }}
      buildedGameUrl={process.env.NEXT_PUBLIC_BASE_CDN_URL || ""}
    />
  );
}