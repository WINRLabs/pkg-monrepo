"use client";

import {
  ReelSpinSettled,
  WinrBonanzaFormFields,
  WinrBonanzaTemplate,
} from "@winrlabs/games";
import { useListenGameEvent } from "../hooks/use-listen-game-event";
import {
  DecodedEvent,
  SingleStepSettledEvent,
  prepareGameTransaction,
} from "../utils";
import React from "react";
import { useContractConfigContext } from "../hooks/use-contract-config";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  useTokenAllowance,
  winrBonanzaAbi,
} from "@winrlabs/web3";
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
} from "viem";
import { useReadContract } from "wagmi";

interface TemplateWithWeb3Props {
  buildedGameUrl: string;
  buildedGameUrlMobile: string;
}

export default function WinrBonanzaTemplateWithWeb3({
  buildedGameUrl,
  buildedGameUrlMobile,
}: TemplateWithWeb3Props) {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
    selectedTokenAddress,
    wagmiConfig,
  } = useContractConfigContext();

  const [formValues, setFormValues] = React.useState<WinrBonanzaFormFields>({
    betAmount: 1,
    actualBetAmount: 1,
    isDoubleChance: false,
  });

  const gameEvent = useListenGameEvent();

  const [settledResult, setSettledResult] = React.useState<ReelSpinSettled>();
  const [previousFreeSpinCount, setPreviousFreeSpinCount] =
    React.useState<number>(0);
  const currentAccount = useCurrentAccount();

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x",
    spender: cashierAddress,
    tokenAddress: selectedTokenAddress,
    showDefaultToasts: false,
  });

  const encodedParams = React.useMemo(() => {
    console.log(
      formValues.actualBetAmount,
      formValues.isDoubleChance,
      "form fields"
    );
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues.actualBetAmount,
      selectedCurrency: selectedTokenAddress,
      lastPrice: 1,
    });

    const encodedGameData = encodeAbiParameters(
      [
        { name: "wager", type: "uint128" },
        { name: "isDoubleChance", type: "bool" },
      ],
      [wagerInWei, formValues.isDoubleChance]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.winrBonanza as Address,
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
  }, [formValues.isDoubleChance, formValues.actualBetAmount]);

  const encodedBuyFreeSpinParams = React.useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues.betAmount,
      selectedCurrency: selectedTokenAddress,
      lastPrice: 1,
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: "wager", type: "uint128" }],
      [wagerInWei]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.winrBonanza as Address,
        tokenAddress,
        uiOperatorAddress as Address,
        "buyFreeSpins",
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [formValues.betAmount, selectedTokenAddress]);

  const encodedFreeSpinParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.betAmount,
      selectedCurrency: selectedTokenAddress,
      lastPrice: 1,
    });

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.winrBonanza as Address,
        tokenAddress,
        uiOperatorAddress as Address,
        "freeSpin",
        "0x",
      ],
    });

    return {
      tokenAddress,
      encodedTxData: encodedData,
    };
  }, [formValues.betAmount, selectedTokenAddress]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.winrBonanza as Address,
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

  const handleBuyFeatureTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.winrBonanza as Address,
        encodedBuyFreeSpinParams.tokenAddress,
        uiOperatorAddress as Address,
        "buyFreeSpins",
        encodedBuyFreeSpinParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedBuyFreeSpinParams.encodedTxData,
  });

  const handleFreeSpinTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.winrBonanza as Address,
        encodedBuyFreeSpinParams.tokenAddress,
        uiOperatorAddress as Address,
        "freeSpin",
        encodedFreeSpinParams.encodedTxData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedFreeSpinParams.encodedTxData,
  });

  const handleBet = async (errorCount = 0) => {
    console.log("spin button called!");

    // if (!allowance.hasAllowance) {
    //   const handledAllowance = await allowance.handleAllowance({
    //     errorCb: (e: any) => {
    //       console.log("error", e);
    //     },
    //   });

    //   if (!handledAllowance) return;
    // }

    console.log("allowance available");

    // await handleTx.mutateAsync();

    try {
      await handleTx.mutateAsync();
    } catch (e: any) {
      if (errorCount < 10) handleBet(errorCount + 1);
      throw new Error(e);
    }
  };

  const handleBuyFreeSpins = async () => {
    // if (!allowance.hasAllowance) {
    //   const handledAllowance = await allowance.handleAllowance({
    //     errorCb: (e: any) => {
    //       console.log("error", e);
    //     },
    //   });
    //   if (!handledAllowance) return;
    // }
    console.log("buy feature");
    await handleBuyFeatureTx.mutateAsync();
  };

  const handleFreeSpin = async (errorCount = 0) => {
    // if (!allowance.hasAllowance) {
    //   const handledAllowance = await allowance.handleAllowance({
    //     errorCb: (e: any) => {
    //       console.log("error", e);
    //     },
    //   });
    //   if (!handledAllowance) return;
    // }

    console.log("handleFreeSpintx called");

    try {
      await handleFreeSpinTx.mutateAsync();
    } catch (e: any) {
      if (errorCount < 10) handleFreeSpin(errorCount + 1);
    }
  };

  const gameDataRead = useReadContract({
    config: wagmiConfig,
    abi: winrBonanzaAbi,
    address: gameAddresses.winrBonanza as `0x${string}`,
    functionName: "getGame",
    args: [currentAccount.address || "0x0000000"],
    query: {
      enabled: !!currentAccount.address,
    },
  });

  const handleRefresh = async () => {};

  React.useEffect(() => {
    const gameData = gameDataRead.data as any;

    if (gameData) {
      setPreviousFreeSpinCount(gameData.freeSpinCount);
    }
  }, [gameDataRead.data]);

  React.useEffect(() => {
    console.log(gameEvent, "GAME EVENT!!");

    if (
      gameEvent?.program[0]?.type == "Game" &&
      gameEvent?.program[0].data?.state == 2
    ) {
      const data = gameEvent.program[0].data;

      setSettledResult({
        betAmount: Number(formatUnits(data.wager, 18)),
        scatterCount: data.result.scatter,
        tumbleCount: data.result.tumble,
        freeSpinsLeft: data.freeSpinCount,
        payoutMultiplier: data.result.payoutMultiplier / 100,
        grid: data.result.outcomes,
        type: "Game",
        spinType: data.spinType,
      });
    }
  }, [gameEvent]);

  return (
    <WinrBonanzaTemplate
      onRefresh={handleRefresh}
      onFormChange={(val) => setFormValues(val)}
      buildedGameUrl={buildedGameUrl}
      buildedGameUrlMobile={buildedGameUrlMobile}
      bet={handleBet}
      buyFreeSpins={handleBuyFreeSpins}
      freeSpin={handleFreeSpin}
      gameEvent={settledResult as ReelSpinSettled}
      previousFreeSpinCount={previousFreeSpinCount}
    />
  );
}
