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

  // const { refetch } = useReadContract({
  //   abi: controllerAbi,
  //   address: controllerAddress as Address,
  //   functionName: "getState",
  //   args: [currentAccount || "0x0"],
  //   enabled: !!currentAccount,
  //   onSuccess: (data) => {
  //     if (data[0].numMines !== 0) {
  //       const newBoard = data[0].revealedCells.map((cell) => {
  //         return {
  //           isSelected: cell,
  //           isBomb: false,
  //           isRevealed: cell,
  //         };
  //       });

  //       const token = getContractName({
  //         network: "arbitrum",
  //         contractAddress: data[0].token,
  //       }) as GameCurrency;

  //       const tokenDecimal = tokenDecimals[token];

  //       const wagerInGameCurrency = formatUnits(data[0].wager, tokenDecimal);

  //       const wager = Number(wagerInGameCurrency) * lastPriceFeed[token];

  //       const _wager = wager < 1 ? Math.ceil(wager) : wager;

  //       form.setValue("wager", toDecimals(_wager, 2));

  //       form.setValue(
  //         "selectedCells",
  //         newBoard.map((cell) => cell.isSelected)
  //       );

  //       form.setValue("minesCount", data[0]?.numMines);

  //       console.log("game set to progress");

  //       updateMinesGameState({
  //         board: newBoard,
  //         gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
  //       });
  //     }
  //   },
  // });

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
        formValues.selectedCells.length
          ? formValues.selectedCells
          : (Array(25).fill(false) as any),
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

    const encodedRevealCellData = encodeAbiParameters(
      [
        { name: "cellsPicked", type: "bool[25]" },
        { name: "isCashout", type: "bool" },
      ],
      [
        formValues.selectedCells.length
          ? formValues.selectedCells
          : (Array(25).fill(false) as any),
        submitType === MINES_SUBMIT_TYPE.CASHOUT ? true : false,
      ]
    );

    const encodedTxRevealCellData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines as Address,
        tokenAddress,
        uiOperatorAddress as Address,
        "revealCells",
        encodedRevealCellData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
      encodedRevealCellData,
      encodedTxRevealCellData,
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
        "0x",
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
        encodedParams.encodedRevealCellData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedTxRevealCellData,
  });

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x0000000",
    spender: cashierAddress,
    tokenAddress: selectedTokenAddress as Address,
    showDefaultToasts: false,
  });

  const onGameSubmit = async () => {
    console.log("onsubmit triggered");
    try {
      if (!allowance.hasAllowance) {
        const handledAllowance = await allowance.handleAllowance({
          errorCb: (e: any) => {
            console.log("error", e);
          },
        });

        console.log("handle allowance", handledAllowance);

        if (!handledAllowance) return;
      }
      if (submitType === MINES_SUBMIT_TYPE.FIRST_REVEAL) {
        console.log(
          formValues.selectedCells.length
            ? formValues.selectedCells
            : (Array(25).fill(false) as any)
        );
        console.log("submit Type:", MINES_SUBMIT_TYPE.FIRST_REVEAL);
        await handleTx.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
      } else if (submitType === MINES_SUBMIT_TYPE.FIRST_REVEAL_AND_CASHOUT) {
        console.log(
          "revealing and cashing out",
          MINES_SUBMIT_TYPE.FIRST_REVEAL_AND_CASHOUT
        );

        await handleTx.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
        });
      } else if (submitType === MINES_SUBMIT_TYPE.REVEAL) {
        console.log("submit Type:", submitType);

        const revealedCells = board.map((cell, idx) => {
          return cell.isRevealed ? false : formValues.selectedCells[idx];
        });

        console.log("revealedCells", revealedCells);

        await handleReveal.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
      } else if (submitType === MINES_SUBMIT_TYPE.CASHOUT) {
        console.log("cashout");
        console.log("submit Type:", submitType);

        await handleCashout.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
        });
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  return (
    <div>
      <MinesTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        gameResults={[]}
        onFormChange={(val) => {
          console.log(val);

          setFormValues(val);
        }}
        minWager={props.minWager}
        maxWager={props.maxWager}
        handleReveal={() => console.log("reveal")}
        handleRevealAndCashout={() => console.log("reveal and cash out")}
        handleGet={() => console.log("handle get")}
      />
    </div>
  );
};

export default MinesTemplateWithWeb3;
