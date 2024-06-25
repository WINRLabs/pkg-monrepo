import { Button } from "../../../ui/button";
import { cn } from "../../../utils/style";
import { MinesForm } from "../types";

const MinesCountButton: React.FC<{
  value: number;
  minesCount: number;
  form: MinesForm;
  isDisabbled?: boolean;
}> = ({ value, minesCount, form, isDisabbled }) => {
  return (
    <Button
      variant={value === minesCount ? "default" : "secondary"}
      className="relative h-10 w-[42px] transition-all"
      type="button"
      disabled={isDisabbled}
      onClick={() => {
        form.setValue("minesCount", value);
      }}
    >
      <span className="z-1">{value}</span>

      <img
        width={20}
        height={20}
        alt="small_icon"
        src={"/imgs/mines/mine-count-img.png"}
        className={cn(
          "absolute bottom-0 right-0 z-0 opacity-0 transition-all duration-150",
          {
            "opacity-100": value === minesCount,
          }
        )}
      />
    </Button>
  );
};

export default MinesCountButton;
