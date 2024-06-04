import { Avatar, Horse } from "../../../svgs";
import { Separator } from "../../../ui/seperator";
import { cn } from "../../../utils/style";
import useHorseRaceGameStore, { Multiplier } from "../store";

const color = {
  gray: " bg-zinc-400/60",
  yellow: "bg-yellow-600/60",
  blue: "bg-blue-600/60",
  green: "bg-green-500/60",
  red: "bg-red-600/60",
};

const iconColor = {
  gray: " text-white ",
  yellow: "text-yellow-500",
  blue: "text-blue-500",
  green: "text-green-500",
  red: "text-red-600",
};

interface HorseDetailProps {
  variant: "gray" | "yellow" | "blue" | "green" | "red";
  multiplier: Multiplier;
}

const HorseDetail: React.FC<HorseDetailProps> = ({ variant, multiplier }) => {
  const { isParticipantsOpen, selectedHorse } = useHorseRaceGameStore([
    "selectedHorse",
    "isParticipantsOpen",
  ]);

  const getHorseDetail = (multiplier: Multiplier, index: number) => {
    if (Array.isArray(selectedHorse[multiplier])) {
      if (selectedHorse[multiplier].length + 1 <= index) {
        return null;
      } else {
        return selectedHorse[multiplier][
          selectedHorse[multiplier].length - index
        ];
      }
    } else {
      return null;
    }
  };

  return (
    <div className="flex">
      <div
        className={cn(
          "mr-0.5 flex w-[140px] flex-col justify-between overflow-hidden transition-all duration-300 max-md:hidden",
          {
            " w-0": !isParticipantsOpen,
          }
        )}
      >
        <div
          className={cn(
            "flex h-[28px] w-[140px] items-center justify-between rounded rounded-tl-md  px-2.5 text-[13px] font-semibold ",
            color[variant]
          )}
        >
          <div
            className="w-[54px] truncate"
            title={getHorseDetail(multiplier, 1)?.name}
          >
            {getHorseDetail(multiplier, 1)?.name}
          </div>
          <div className="flex">
            {getHorseDetail(multiplier, 1)?.bet ? (
              <>
                {getHorseDetail(multiplier, 1)?.bet}

                <img
                  width={16}
                  height={16}
                  src="/images/tokens/usdc.png"
                  alt="usdc"
                  className="ml-0.5 shrink-0"
                />
              </>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "flex h-[28px] w-[140px] items-center justify-between rounded   px-2.5 text-[13px] font-semibold ",
            color[variant]
          )}
        >
          <div
            className="w-[54px] truncate"
            title={getHorseDetail(multiplier, 2)?.name}
          >
            {getHorseDetail(multiplier, 2)?.name}
          </div>
          <div className="flex">
            {getHorseDetail(multiplier, 2)?.bet ? (
              <>
                {getHorseDetail(multiplier, 2)?.bet}{" "}
                <img
                  width={16}
                  height={16}
                  src="/images/tokens/usdc.png"
                  alt="usdc"
                  className="ml-0.5 shrink-0"
                />
              </>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "flex h-[28px] w-[140px] items-center justify-between rounded   px-2.5 text-[13px] font-semibold ",
            color[variant]
          )}
        >
          <div
            className="w-[54px] truncate"
            title={getHorseDetail(multiplier, 3)?.name}
          >
            {getHorseDetail(multiplier, 3)?.name}
          </div>
          <div className="flex">
            {getHorseDetail(multiplier, 3)?.bet ? (
              <>
                {getHorseDetail(multiplier, 3)?.bet}{" "}
                <img
                  width={16}
                  height={16}
                  src="/images/tokens/usdc.png"
                  alt="usdc"
                  className="ml-0.5 shrink-0"
                />
              </>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "flex h-[28px] w-[140px] items-center justify-between rounded rounded-bl-md   px-2.5 text-[13px] font-semibold ",
            color[variant]
          )}
        >
          <div
            className="w-[54px] truncate"
            title={getHorseDetail(multiplier, 4)?.name}
          >
            {getHorseDetail(multiplier, 4)?.name}
          </div>
          <div className="flex">
            {getHorseDetail(multiplier, 4)?.bet ? (
              <>
                {getHorseDetail(multiplier, 4)?.bet}{" "}
                <img
                  width={16}
                  height={16}
                  src="/images/tokens/usdc.png"
                  alt="usdc"
                  className="ml-0.5 shrink-0"
                />
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-row items-center gap-1 rounded-md p-2 text-[14px]  font-semibold md:w-10 md:flex-col",
          color[variant]
        )}
      >
        <Horse className={cn("h-5 w-5", iconColor[variant])} />
        <div>{multiplier}</div>
        <Separator className="my-2 max-md:hidden " />
        <Separator className="mx-2 md:hidden " orientation="vertical" />
        <Avatar />
        <div>{selectedHorse[multiplier].length}</div>
      </div>
    </div>
  );
};

export default HorseDetail;
