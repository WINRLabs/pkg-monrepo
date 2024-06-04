import { AlignLeft } from "../../../svgs";
import { Button } from "../../../ui/button";
import { cn } from "../../../utils/style";
import useHorseRaceGameStore from "../store";
import HorseDetail from "./horse-detail";

const SelectedHorseDetail = () => {
  const { isParticipantsOpen, setIsParticipantsOpen } = useHorseRaceGameStore([
    "isParticipantsOpen",
    "setIsParticipantsOpen",
  ]);

  return (
    <div className="absolute left-3 top-0 z-[15] w-full md:left-[unset] md:right-3.5 md:top-1 md:h-full md:max-w-[250px]">
      <Button
        variant="secondary"
        type="button"
        className={cn(
          "absolute top-0 h-9  w-9 bg-zinc-100/60 p-0 transition-all duration-200 max-md:hidden",
          {
            "right-[190px]": isParticipantsOpen,
            "right-[45px]": !isParticipantsOpen,
          }
        )}
        onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
      >
        <AlignLeft
          className={cn("rotate-180 transition-all duration-300", {
            "rotate-0": !isParticipantsOpen,
          })}
        />
      </Button>
      <div className="absolute top-[285px] flex items-end gap-2 max-md:w-full max-md:overflow-scroll max-md:pr-5  max-md:scrollbar-none md:right-0 md:top-0   md:flex-col">
        <HorseDetail variant="gray" multiplier="2x" />
        <HorseDetail variant="yellow" multiplier="3x" />
        <HorseDetail variant="blue" multiplier="8x" />
        <HorseDetail variant="green" multiplier="15x" />
        <HorseDetail variant="red" multiplier="60x" />
      </div>
    </div>
  );
};

export default SelectedHorseDetail;
