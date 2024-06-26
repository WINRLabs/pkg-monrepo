import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useFormContext } from "react-hook-form";
import { MineCellBg } from "../../../svgs";
import { FormControl, FormField, FormItem } from "../../../ui/form";
import { cn } from "../../../utils/style";
import { boardsSchema, initialBoard } from "../constants";
import { useMinesGameStateStore } from "../store";
import { MinesForm } from "../types";

const MineCell: React.FC<{
  mineCell: (typeof initialBoard)["0"];
  idx: number;
}> = ({ mineCell, idx }) => {
  const form = useFormContext() as MinesForm;

  const { updateBoardItem } = useMinesGameStateStore();

  return (
    <FormField
      control={form.control}
      name="selectedCells"
      render={({ field }) => {
        return (
          <FormItem className="mb-0 aspect-square lg:aspect-auto">
            <FormControl>
              <CheckboxPrimitive.Root
                className={cn("h-full w-full")}
                checked={field.value[idx]}
                onCheckedChange={(checked) => {
                  const currentSelectedCellAmount = field.value.filter(
                    (item) => item === true
                  ).length;

                  const currentSchema =
                    boardsSchema[form.getValues().minesCount - 1];

                  //   if (currentSchema === undefined) {
                  //     toast({
                  //       title: "Error",
                  //       description: "Please select mines count",
                  //       variant: "error",
                  //     });

                  //     return;
                  //   } else if (
                  //     currentSelectedCellAmount >= currentSchema.maxReveal &&
                  //     !field.value[idx]
                  //   ) {
                  //     toast({
                  //       title: "Error",
                  //       description: `You can select maximum ${currentSchema.maxReveal} cells`,
                  //       variant: "error",
                  //     });

                  //     return;
                  //   }

                  updateBoardItem(idx, {
                    ...mineCell,
                    isSelected: checked ? true : false,
                  });

                  const newSelectedCells = [...field.value];

                  newSelectedCells[idx] = checked ? true : false;

                  return field.onChange(newSelectedCells);
                }}
                disabled={mineCell.isBomb || mineCell.isRevealed}
              >
                <div className="relative aspect-square lg:aspect-auto  lg:h-[120px] lg:w-[120px]">
                  <MineCellBg
                    className={cn(
                      "absolute left-0 top-0 rounded-xl text-zinc-700 opacity-100 transition-all duration-300 hover:scale-105",
                      {
                        "text-red-600": mineCell.isSelected,
                        "opacity-0": mineCell.isRevealed,
                      }
                    )}
                  />

                  <div
                    className={cn(
                      "absolute -bottom-20 left-0 flex h-full w-full items-center justify-center rounded-xl opacity-100 transition-all duration-500",
                      {
                        "opacity-0": !mineCell.isRevealed,
                        "bottom-0": mineCell.isRevealed,
                      }
                    )}
                    style={{
                      background: mineCell.isBomb
                        ? "radial-gradient(76.92% 76.92% at 69.23% 38.46%, #EF4444 24.51%, #DC2626 77.06%)"
                        : "radial-gradient(97.56% 97.56% at 69.23% 38.46%, #A3E635 24.51%, #65A30D 77.06%)",
                    }}
                  >
                    <img
                      src={
                        mineCell.isBomb
                          ? "/images/mines/revealed-mine.png"
                          : "/images/mines/revealed-gem.png"
                      }
                      width={88}
                      height={88}
                      alt="revealed gem"
                    />
                  </div>
                </div>

                {/* {mineCell.isRevealed && !mineCell.isBomb && (
                    <div
                      className="relative flex h-[120px] w-[120px] items-center justify-center rounded-xl"
                      style={{
                        background:
                          "radial-gradient(97.56% 97.56% at 69.23% 38.46%, #A3E635 24.51%, #65A30D 77.06%)",
                      }}
                    >
                      <Image
                        src="/images/mines/revealed-gem.png"
                        width={88}
                        height={88}
                        alt="revealed gem"
                      />
                    </div>
                  )}
                  {mineCell.isBomb && (
                    <div
                      className="flex h-[120px] w-[120px] items-center justify-center rounded-xl"
                      style={{
                        background:
                          "radial-gradient(76.92% 76.92% at 69.23% 38.46%, #EF4444 24.51%, #DC2626 77.06%)",
                      }}
                    >
                      <Image
                        src="/images/mines/revealed-mine.png"
                        width={88}
                        height={88}
                        alt="revealed mine"
                      />
                    </div>
                  )} */}
              </CheckboxPrimitive.Root>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default MineCell;
