"use client";

import { useForm } from "react-hook-form";
import {
  CoinSide,
  MAX_BET_COUNT,
  MIN_BET_COUNT,
  WIN_MULTIPLIER,
} from "../constants";
import { CoinFlipGameProps } from "./game";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, cn } from "@winrlabs/ui";
import { GameContainer, SceneContainer } from "../../../common/containers";
import { BetController } from "./bet-controller";
import { CoinFlip } from "..";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = CoinFlipGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmit: (data: any) => void;
};

const CoinFlipTemplate = ({ ...props }: TemplateProps) => {
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
      .min(MIN_BET_COUNT, { message: "Minimum bet count is 1" })
      .max(MAX_BET_COUNT, {
        message: "Maximum bet count is 100",
      }),
    stopGain: z.number(),
    stopLoss: z.number(),
    coinSide: z.nativeEnum(CoinSide),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: "onSubmit",
    defaultValues: {
      wager: 1,
      betCount: 1,
      stopGain: 0,
      stopLoss: 0,
      coinSide: CoinSide.HEADS,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)}>
        <GameContainer>
          <BetController
            minWager={props.minWager || 2}
            maxWager={props.maxWager || 10}
            winMultiplier={WIN_MULTIPLIER}
          />
          <SceneContainer
            className={cn("h-[640px]  max-md:h-[425px] lg:py-12 relative")}
            style={{
              backgroundImage: options?.scene?.backgroundImage,
            }}
          >
            <CoinFlip.Body>
              <CoinFlip.Game {...props}>
                <CoinFlip.LastBets />
                <CoinFlip.Coin {...props} />
                <CoinFlip.Controller />
              </CoinFlip.Game>
            </CoinFlip.Body>
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default CoinFlipTemplate;