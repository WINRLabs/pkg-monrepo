"use client";

import {
  MINES_GAME_STATUS,
  MINES_SUBMIT_TYPE,
  MinesFormField,
  MinesGameResult,
  MinesTemplate,
  toDecimals,
  useMinesGameStateStore,
} from "@winrlabs/games";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  useTokenAllowance,
} from "@winrlabs/web3";
import { useMemo, useState } from "react";
import { useContractConfigContext } from "../hooks/use-contract-config";
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
} from "viem";
import { useReadContract } from "wagmi";
import { prepareGameTransaction } from "../utils";

interface TemplateWithWeb3Props {
  minWager?: number;
  maxWager?: number;
  onAnimationCompleted?: (result: MinesGameResult[]) => void;
}

const MinesTemplateWithWeb3 = ({ ...props }: TemplateWithWeb3Props) => {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
    selectedTokenAddress,
  } = useContractConfigContext();

  const [formValues, setFormValues] = useState<MinesFormField>({
    wager: 1,
    minesCount: 1,
    selectedCells: [],
  });

  const currentAccount = useCurrentAccount();

  const { submitType, updateMinesGameState, board } = useMinesGameStateStore([
    "submitType",
    "updateMinesGameState",
    "board",
  ]);

  const { refetch } = useReadContract({
    abi: controllerAbi,
    address: controllerAddress as Address,
    functionName: "getState",
    args: [currentAccount || "0x0"],
    enabled: !!currentAccount,
    onSuccess: (data) => {
      if (data[0].numMines !== 0) {
        const newBoard = data[0].revealedCells.map((cell) => {
          return {
            isSelected: cell,
            isBomb: false,
            isRevealed: cell,
          };
        });

        const token = getContractName({
          network: "arbitrum",
          contractAddress: data[0].token,
        }) as GameCurrency;

        const tokenDecimal = tokenDecimals[token];

        const wagerInGameCurrency = formatUnits(data[0].wager, tokenDecimal);

        const wager = Number(wagerInGameCurrency) * lastPriceFeed[token];

        const _wager = wager < 1 ? Math.ceil(wager) : wager;

        form.setValue("wager", toDecimals(_wager, 2));

        form.setValue(
          "selectedCells",
          newBoard.map((cell) => cell.isSelected)
        );

        form.setValue("minesCount", data[0]?.numMines);

        console.log("game set to progress");

        updateMinesGameState({
          board: newBoard,
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
      }
    },
  });

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei, stopGainInWei, stopLossInWei } =
      prepareGameTransaction({
        wager: formValues.wager,
        selectedCurrency: selectedTokenAddress,
        lastPrice: 1,
      });

    const encodedGameData = encodeAbiParameters(
      [
        { name: "wager", type: "uint128" },
        { name: "numMines", type: "uint8" },
        { name: "cellsPicked", type: "bool[25]" },
        { name: "isCashout", type: "bool" },
      ],
      [
        wagerInWei,
        formValues.minesCount,
        formValues.selectedCells as any,
        submitType === MINES_SUBMIT_TYPE.CASHOUT ? true : false,
      ]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines as Address,
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
    formValues.minesCount,
    formValues.selectedCells,
    formValues.wager,
    submitType,
  ]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines,
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

  const handleCashout = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines,
        encodedParams.tokenAddress,
        uiOperatorAddress as Address,
        "endGame",
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedTxData,
  });

  const handleReveal = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines,
        encodedParams.tokenAddress,
        uiOperatorAddress as Address,
        "revealCells",
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedTxData,
  });

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x0000000",
    spender: cashierAddress,
    tokenAddress: selectedTokenAddress as Address,
    showDefaultToasts: false,
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
  };

  return (
    <MinesTemplate
      {...props}
      onSubmitGameForm={onGameSubmit}
      gameResults={[]}
      onFormChange={(val) => {
        setFormValues(val);
      }}
    />
  );
};

export default MinesTemplateWithWeb3;
