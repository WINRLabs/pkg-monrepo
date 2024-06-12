import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "../../../ui/form";
import { GameContainer, SceneContainer } from "../../../common/containers";
import { BaccaratBetController } from "./baccarat-bet-controller";
import React from "react";
import { MULTIPLIER_BANKER, MULTIPLIER_TIE } from "../constants";
import {
  BaccaratBetType,
  BaccaratFormFields,
  BaccaratGameResult,
  BaccaratGameSettledResult,
} from "../types";
import { Chip } from "../../../common/chip-controller/types";
import { RouletteFormFields } from "../../roulette";
import debounce from "debounce";
import { CDN_URL } from "../../../constants";
import { BaccaratScene } from "./baccarat-scene";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;

  onAnimationCompleted: (r: BaccaratGameSettledResult) => void;
  onSubmitGameForm: (data: BaccaratFormFields) => void;
  onFormChange?: (fields: BaccaratFormFields) => void;
};

const BaccaratTemplate: React.FC<TemplateProps> = ({
  options,
  minWager,
  maxWager,

  onAnimationCompleted,
  onSubmitGameForm,
  onFormChange,
}) => {
  const [maxPayout, setMaxPayout] = React.useState<number>(0);

  const [isGamePlaying, setIsGamePlaying] = React.useState<boolean>(false);

  const [lastSelections, setLastSelections] = React.useState<
    {
      type: BaccaratBetType;
      wager: number;
    }[]
  >([]);

  const [selectedChip, setSelectedChip] = React.useState<Chip>(Chip.ONE);
  const [baccaratResults, setBaccaratResults] =
    React.useState<BaccaratGameResult | null>(null);
  const [baccaratSettled, setBaccaratSettled] =
    React.useState<BaccaratGameSettledResult | null>(null);

  const formSchema = z.object({
    playerWager: z
      .number()
      .min(0, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
    bankerWager: z
      .number()
      .min(0, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
    tieWager: z
      .number()
      .min(0, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    defaultValues: {
      playerWager: 0,
      bankerWager: 0,
      tieWager: 0,
    },
  });

  const tieWager = form.watch("tieWager");

  const bankerWager = form.watch("bankerWager");

  const playerWager = form.watch("playerWager");

  const addWager = (wager: Chip, betType: BaccaratBetType) => {
    const totalWager = tieWager + bankerWager + playerWager;

    const newWager = wager + totalWager;

    const _maxWager = maxWager || 2000;

    // if (newWager > _maxWager) {
    //   toast({
    //     variant: "error",
    //     title: "OOPS!",
    //     description: `You can bet up to $${toDecimals(_maxWager, 0)}`,
    //   });

    //   return;
    // }

    const _lastSelections = lastSelections;

    switch (betType) {
      case BaccaratBetType.TIE:
        form.setValue("tieWager", tieWager + wager);

        _lastSelections.push({ type: BaccaratBetType.TIE, wager });

        break;

      case BaccaratBetType.BANKER:
        form.setValue("bankerWager", bankerWager + wager);

        _lastSelections.push({ type: BaccaratBetType.BANKER, wager });

        break;

      case BaccaratBetType.PLAYER:
        form.setValue("playerWager", playerWager + wager);

        _lastSelections.push({ type: BaccaratBetType.PLAYER, wager });

        break;
    }

    setLastSelections([..._lastSelections]);
  };

  const undoBet = () => {
    if (!lastSelections.length) return;

    // get last index
    const lastSelectionIdx = lastSelections.length - 1;

    const lastSelection = lastSelections[lastSelectionIdx];

    // call selected numbers and remove last wager
    if (lastSelection?.type === BaccaratBetType.TIE) {
      form.setValue("tieWager", tieWager - lastSelection.wager);
    }

    if (lastSelection?.type === BaccaratBetType.BANKER) {
      form.setValue("bankerWager", bankerWager - lastSelection.wager);
    }

    if (lastSelection?.type === BaccaratBetType.PLAYER) {
      form.setValue("playerWager", playerWager - lastSelection.wager);
    }

    // remove last selection
    lastSelections.pop();

    setLastSelections([...lastSelections]);
  };

  React.useEffect(() => {
    const tieMaxPayout = tieWager * MULTIPLIER_TIE;

    const bankerMaxPayout = bankerWager * MULTIPLIER_BANKER;

    const playerMaxPayout = playerWager * MULTIPLIER_BANKER;

    if (tieMaxPayout > bankerMaxPayout && tieMaxPayout > playerMaxPayout)
      setMaxPayout(tieMaxPayout);
    else if (
      bankerMaxPayout > tieMaxPayout &&
      bankerMaxPayout > playerMaxPayout
    )
      setMaxPayout(bankerMaxPayout);
    else setMaxPayout(playerMaxPayout);
  }, [bankerWager, playerWager, tieWager]);

  const prepareSubmit = (data: BaccaratFormFields) => {
    setBaccaratResults(null);
    setBaccaratSettled(null);
    setIsGamePlaying(true);

    onSubmitGameForm(data);
  };

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      onFormChange && onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(prepareSubmit)}>
        <GameContainer className="relative overflow-hidden pt-0">
          <SceneContainer
            className="relative flex h-[600px]"
            style={{
              backgroundImage: `url(${CDN_URL}/baccarat/baccarat-bg.png)`,
            }}
          >
            <BaccaratScene
              baccaratResults={baccaratResults}
              baccaratSettled={baccaratSettled}
              isDisabled={isGamePlaying}
              setIsDisabled={setIsGamePlaying}
              addWager={addWager}
              selectedChip={selectedChip}
              onAnimationCompleted={onAnimationCompleted}
            />

            <BaccaratBetController
              isDisabled={isGamePlaying}
              totalWager={bankerWager + tieWager + playerWager}
              maxPayout={maxPayout}
              undoBet={undoBet}
              selectedChip={selectedChip}
              onSelectedChipChange={setSelectedChip}
            />
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};
