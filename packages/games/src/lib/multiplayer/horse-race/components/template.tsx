"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UnityGameContainer } from "../../../common/containers";
import useMediaQuery from "../../../hooks/use-media-query";
import { Form } from "../../../ui/form";
import { Horse, horseMultipliers } from "../constants";
import useHorseRaceGameStore from "../store";
import { HorseRaceFormFields } from "../types";
import { HorseRaceBetController } from "./bet-controller";
import { HorseRaceGameProps } from "./game";
import { LastBets } from "./last-bets";
import { RacingScene } from "./scene";
import SelectedHorseDetail from "./selected-horse-detail";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
    loader?: string;
    logo?: string;
  };
};

type TemplateProps = HorseRaceGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  winMultiplier?: number;
  onSubmitGameForm: (data: HorseRaceFormFields) => void;
  buildedGameUrl: string;
  onComplete: () => void;
  currentAccount: string;
  history: any;
};

export const HorseRaceTemplate = ({ ...props }: TemplateProps) => {
  const { selectedHorse: participants } = useHorseRaceGameStore([
    "selectedHorse",
  ]);

  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 2, {
        message: `Minimum wager is ${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is ${props?.maxWager}`,
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

  const selectedHorse = form.watch("horse");

  const currentWager = form.watch("wager");

  const maxPayout = horseMultipliers[selectedHorse] * currentWager;

  const isGamblerParticipant = React.useMemo(() => {
    if (
      participants["15x"].find((p) => p.name === props.currentAccount) ||
      participants["2x"].find((p) => p.name === props.currentAccount) ||
      participants["3x"].find((p) => p.name === props.currentAccount) ||
      participants["60x"].find((p) => p.name === props.currentAccount) ||
      participants["8x"].find((p) => p.name === props.currentAccount)
    )
      return true;
    else return false;
  }, [participants]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
        <UnityGameContainer
          className="relative h-[840px]  overflow-hidden rounded-xl border border-zinc-800  md:h-[640px]"
          id="animationScene"
        >
          <HorseRaceBetController
            minWager={props?.minWager || 2}
            maxWager={props?.maxWager || 2000}
            maxPayout={maxPayout}
            isGamblerParticipant={isGamblerParticipant}
          />
          <LastBets isFinished={isFinished} history={props.history} />

          <RacingScene onComplete={props.onComplete} />

          <div className="absolute top-0 z-10 h-full w-full md:bg-unity-overlay" />
          <SelectedHorseDetail />
        </UnityGameContainer>
      </form>
    </Form>
  );
};
