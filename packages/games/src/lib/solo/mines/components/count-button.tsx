import { CDN_URL } from "../../../constants";
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
      className="wr-relative wr-h-10 wr-w-[42px] wr-transition-all"
      type="button"
      disabled={isDisabbled}
      onClick={() => {
        form.setValue("minesCount", value);
      }}
    >
      <span className="wr-z-1">{value}</span>

      <img
        width={20}
        height={20}
        alt="small_icon"
        src={`${CDN_URL}/mines/mine-count-image.png`}
        className={cn(
          "wr-absolute wr-bottom-0 wr-right-0 wr-z-0 wr-opacity-0 wr-transition-all wr-duration-150",
          {
            "wr-opacity-100": value === minesCount,
          }
        )}
      />
    </Button>
  );
};

export default MinesCountButton;
