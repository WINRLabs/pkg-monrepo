import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import z from "zod";
import { Mines } from "..";
import { GameContainer, SceneContainer } from "../../../common/containers";
import { Form } from "../../../ui/form";
import { toDecimals } from "../../../utils/web3";
import { initialBoard } from "../constants";
import mineMultipliers from "../constants/mines-multipliers.json";
import { useMinesGameStateStore } from "../store";
import { FormSetValue, MinesFormField } from "../types";
import { MinesGameProps } from "./game";
import debounce from "debounce";

type TemplateProps = MinesGameProps & {
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: MinesFormField) => void;
  onFormChange?: (fields: MinesFormField) => void;
  handleReveal: () => void;
  handleRevealAndCashout: () => void;
  handleGet: () => void;

  formSetValue?: FormSetValue;
};

const MinesTemplate = ({ ...props }: TemplateProps) => {
  const { board } = useMinesGameStateStore(["board"]);

  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 2, {
        message: `Minimum wager is ${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is ${props?.maxWager}`,
      }),
    minesCount: z.number().max(24).min(1),
    selectedCells: z.array(z.boolean()).length(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: "all",
    defaultValues: {
      wager: 2,
      minesCount: 1,
      selectedCells: initialBoard.map((mine) => mine.isSelected),
    },
  });

  const selectedCells = form.watch("selectedCells");

  const minesCount = form.watch("minesCount");

  const _wager = form.watch("wager");

  const currentMultiplier = React.useMemo(() => {
    const multiplier =
      mineMultipliers.find(
        (val) =>
          val.numOfMines === minesCount &&
          val.reveal === selectedCells.filter((val) => val === true).length
      )?.multiplier || 0;

    return toDecimals(Number(multiplier) / 10000, 2);
  }, [selectedCells, minesCount]);

  const currentCashoutAmount = React.useMemo(() => {
    const currentScheme = mineMultipliers.filter(
      (scheme) => scheme.numOfMines === minesCount
    );

    const currentRevealAmount = currentScheme.find(
      (scheme) =>
        scheme.reveal === board.filter((val) => val.isRevealed === true).length
    );

    const currentMultiplier = toDecimals(
      Number(currentRevealAmount?.multiplier) || 0,
      2
    );

    return toDecimals((_wager * currentMultiplier) / 10000, 2);
  }, [board, minesCount, _wager]);

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      props?.onFormChange && props.onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  React.useEffect(() => {
    if (!props.formSetValue) return;

    form.setValue(props.formSetValue.key, props.formSetValue.value);
  }, [props.formSetValue]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
        <GameContainer>
          <Mines.Game {...props}>
            <Mines.Controller
              {...props}
              currentCashoutAmount={currentCashoutAmount}
              maxWager={props?.maxWager || 2000}
              minWager={props?.minWager || 2}
              currentMultiplier={currentMultiplier}
            />
            <SceneContainer className="lg:wr-h-[790px]">
              <Mines.Scene currentMultiplier={currentMultiplier} />
            </SceneContainer>
          </Mines.Game>
        </GameContainer>
      </form>
    </Form>
  );
};

export default MinesTemplate;
