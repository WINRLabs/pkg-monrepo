import { useFormContext } from "react-hook-form";
import { FormField, FormItem } from "../../../ui/form";
import { useMinesGameStateStore } from "../store";
import { MinesForm } from "../types";
import MineCell from "./cell";

export const MinesScene = ({
  currentMultiplier,
}: {
  currentMultiplier: number;
}) => {
  const form = useFormContext() as MinesForm;

  const { board } = useMinesGameStateStore();

  return (
    <section className="h-full w-full text-center lg:h-[unset] lg:w-[unset]">
      <FormField
        name="selectedCells"
        control={form.control}
        render={({ field }) => (
          <FormItem className="mb-1 grid aspect-square grid-cols-5 grid-rows-5 items-center justify-center gap-2 lg:aspect-auto">
            {board.map((mine, idx) => {
              return <MineCell idx={idx} mineCell={mine} key={idx} />;
            })}
          </FormItem>
        )}
      />
      <div className="mx-auto max-w-fit rounded-lg border border-zinc-800 bg-zinc-900 px-8 py-2 text-4xl font-bold">
        <p className="mb-1 text-sm text-zinc-500">Current Multiplier</p>X{" "}
        <span>{currentMultiplier}</span>
      </div>
    </section>
  );
};
