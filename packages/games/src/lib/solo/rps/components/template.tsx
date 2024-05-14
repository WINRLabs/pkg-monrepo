"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form } from "../../../ui/form";
import { GameContainer, SceneContainer } from "../../../common/containers";
import { Rps } from "..";
import { BetController } from "./bet-controller";
import { RockPaperScissors, RpsFormField } from "../types";
import { RpsGameProps } from "./game";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = RpsGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmit: (data: RpsFormField) => void;
};

const RpsTemplate = ({ ...props }: TemplateProps) => {
  const options = { ...props.options };

  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 2, {
        message: `Minimum wager is ${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is ${props?.maxWager}`,
      }),
    betCount: z
      .number()
      .min(1, { message: "Minimum bet count is 1" })
      .max(100, {
        message: "Maximum bet count is 100",
      }),
    stopGain: z.number(),
    stopLoss: z.number(),
    rpsChoice: z.nativeEnum(RockPaperScissors),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: "all",
    defaultValues: {
      wager: 2,
      betCount: 1,
      stopGain: 0,
      stopLoss: 0,
      rpsChoice: RockPaperScissors.ROCK,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)}>
        <GameContainer>
          <BetController
            maxWager={props?.maxWager || 10}
            minWager={props?.minWager || 2}
            winMultiplier={1.96}
          />
          <SceneContainer
            className="wr-relative wr-h-[640px] wr-overflow-hidden !wr-p-0 max-md:wr-h-[450px]"
            style={{
              backgroundImage: options?.scene?.backgroundImage,
            }}
          >
            <Rps.Game {...props}>
              <Rps.LastBets />
              <Rps.Scene {...props} />
            </Rps.Game>
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default RpsTemplate;