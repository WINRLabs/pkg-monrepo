"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { HorseRace } from "..";
import { UnityGameContainer } from "../../../common/containers";
import { Form } from "../../../ui/form";
import { Horse, horseMultipliers } from "../constants";
import useHorseRaceGameStore from "../store";
import { HorseRaceFormFields } from "../types";
import { HorseRaceGameProps } from "./game";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
    loader?: string;
  };
  controller: {
    logo: string;
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
          className="wr-relative wr-h-[840px]  wr-overflow-hidden wr-rounded-xl wr-border wr-border-zinc-800  md:wr-h-[640px]"
          id="animationScene"
        >
          <HorseRace.BetController
            minWager={props?.minWager || 2}
            maxWager={props?.maxWager || 2000}
            maxPayout={maxPayout}
            isGamblerParticipant={isGamblerParticipant}
            logo={props.options.controller.logo}
          />

          <HorseRace.Game {...props}>
            <HorseRace.LastBets history={props.history} />

            <HorseRace.Scene
              onComplete={props.onComplete}
              buildedGameUrl={props.buildedGameUrl}
            />

            <div className="wr-absolute wr-top-0 wr-z-10 wr-h-full wr-w-full md:wr-bg-unity-overlay" />
            <HorseRace.SelectedHorseDetail />
          </HorseRace.Game>
        </UnityGameContainer>
      </form>
    </Form>
  );
};
