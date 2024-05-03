import { cn } from "@winrlabs/ui";
import { useRangeGameStore } from "..";
import { LastBetsContainer } from "../../../common/last-bets-container";

export const RangeLastBets: React.FC = () => {
  const { lastBets } = useRangeGameStore(["lastBets"]);

  return (
    <LastBetsContainer>
      {lastBets?.map((result, index) => {
        return (
          <div
            key={index}
            className={cn(
              "wr-flex wr-h-7 wr-w-[53px] wr-flex-shrink-0 wr-items-center wr-justify-center wr-rounded-[1000px] wr-bg-zinc-700 wr-font-semibold wr-text-zinc-100",
              {
                "wr-bg-green-500": result.payout > 0,
              }
            )}
          >
            <div className="wr-text-zinc-100">{result.resultNumber}</div>
          </div>
        );
      })}
    </LastBetsContainer>
  );
};
