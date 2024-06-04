"use client";

import * as z from "zod";

import { LastBets } from "./last-bets";
import useHorseRaceGameStore from "../store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Horse, horseMultipliers, participantMapWithStore } from "../constants";
import React from "react";
import useMediaQuery from "../../../hooks/use-media-query";
import { SoundEffects, useAudioEffect } from "../../../hooks/use-audio-effect";
import { Form } from "../../../ui/form";
import { UnityGameContainer } from "../../../common/containers";
import { HorseRaceBetController } from "./bet-controller";
import { RacingScene } from "./scene";
import SelectedHorseDetail from "./selected-horse-detail";

const BUNDLER_WS_URL = process.env.NEXT_PUBLIC_BUNDLER_WS_URL || "";

export const HorseRaceTemplate = () => {
  const {
    updateState,
    addLastBet,
    setSelectedHorse,
    selectedHorse: participants,
  } = useHorseRaceGameStore([
    "updateState",
    "setSelectedHorse",
    "addLastBet",
    "selectedHorse",
  ]);

  const formSchema = z.object({
    wager: z
      .number()
      .min(data?.minWager || 2, {
        message: `Minimum wager is ${data?.minWager}`,
      })
      .max(data?.maxWager || 2000, {
        message: `Maximum wager is ${data?.maxWager}`,
      }),
    horse: z.nativeEnum(Horse),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: "all",
    defaultValues: {
      wager: 2,
      horse: Horse.IDLE,
    },
  });

  const [finishedEvent, setFinishedEvent] = React.useState<any>();

  const isMobile = useMediaQuery("(max-width: 1024px)");

  const selectedHorse = form.watch("horse");

  const currentWager = form.watch("wager");

  const maxPayout = horseMultipliers[selectedHorse] * currentWager;

  const isGamblerParticipant = React.useMemo(() => {
    if (
      participants["15x"].find((p) => p.name === currentAccount) ||
      participants["2x"].find((p) => p.name === currentAccount) ||
      participants["3x"].find((p) => p.name === currentAccount) ||
      participants["60x"].find((p) => p.name === currentAccount) ||
      participants["8x"].find((p) => p.name === currentAccount)
    )
      return true;
    else return false;
  }, [participants]);

  const newParticipateEffect = useAudioEffect(SoundEffects.WIN);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values", values);

    try {
      if (!allowance.hasAllowance) {
        const handledAllowance = await allowance.handleAllowance({
          errorCb: (e: any) => {
            toast({
              variant: "error",
              title: "OOPS!",
              description: "Could not retrieve allowance.",
            });
          },
        });

        if (!handledAllowance) return;
      }

      const { tokenAddress, wagerInWei } = prepareGameTransaction({
        wager: values.wager,
        selectedCurrency,
        lastPrice: lastPriceFeed[selectedCurrency],
      });

      await handleTransaction({
        args: [wagerInWei, Number(values.horse), tokenAddress],
      });
    } catch (e: any) {
      console.log("erreoe", e);

      if (e?.error) {
        toast({
          variant: "error",
          title: "Transaction rejected",
          description: e?.error?.message || e?.error,
        });
      } else {
        toast({
          variant: "error",
          title: "Transaction rejected",
          description: "Something went wrong",
        });
      }
    }
  }

  function onComplete() {
    if (!finishedEvent) return;

    updateIsFinished(false);

    !isMobile && setIsHidden(false);

    addGameResult<any>({
      gameResult: finishedEvent.result,
    });

    const isWon = Number(selectedHorse) === finishedEvent.result.horse;

    const horse = finishedEvent.result.horse;

    updatePlayedNotifications({
      duration: 5000,
      component: (
        <div
          className={cn(
            "flex h-6 w-12 items-center justify-center rounded-[1000px]",
            {
              "bg-gray-400": horse === Number(Horse.ONE),
              "bg-yellow-400": horse === Number(Horse.TWO),
              "bg-green-400": horse === Number(Horse.THREE),
              "bg-blue-400": horse === Number(Horse.FOUR),
              "bg-red-400": horse === Number(Horse.FIVE),
            }
          )}
        >
          {horseMultipliers[finishedEvent.result.horse as Horse]}X
        </div>
      ),
      payoutInUsd: isWon
        ? currentWager * horseMultipliers[finishedEvent.result.horse as Horse]
        : 0,
      won: isWon,
      wagerInUsd: currentWager,
    });

    const multiplier = participantMapWithStore[horse as Horse];

    const _payoutInUsd = isWon
      ? currentWager * horseMultipliers[finishedEvent.result.horse as Horse]
      : 0;

    const profit = _payoutInUsd - currentWager;

    showWinAnimation({
      profit,
      wager: currentWager,
      payout: _payoutInUsd,
    });

    refreshUserData();

    addLastBet(multiplier);

    setTimeout(() => {
      updateIsFinished(true);
    }, 5000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <UnityGameContainer
          className="relative h-[840px]  overflow-hidden rounded-xl border border-zinc-800  md:h-[640px]"
          id="animationScene"
        >
          <HorseRaceBetController
            minWager={data?.minWager || 2}
            maxWager={data?.maxWager || 2000}
            maxPayout={maxPayout}
            isGamblerParticipant={isGamblerParticipant}
          />
          <LastBets isFinished={isFinished} />

          <RacingScene onComplete={onComplete} />

          <div className="absolute top-0 z-10 h-full w-full md:bg-unity-overlay" />
          <SelectedHorseDetail />
        </UnityGameContainer>
      </form>
    </Form>
  );
};
