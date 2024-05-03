import { cn } from "@winrlabs/ui";
import { CoinFlipGameResult, CoinSide, useCoinFlipGameStore } from "..";
import { CDN_URL } from "../../../constants";

const LastBet = ({ result }: { result: CoinFlipGameResult }) => {
  return (
    <div
      className={cn(
        "wr-flex wr-h-7 wr-w-[70px] wr-flex-shrink-0 wr-items-center wr-justify-center wr-rounded-[1000px] wr-bg-zinc-700 wr-font-semibold wr-text-zinc-100",
        {
          "wr-bg-green-500": result.payout > 0,
        }
      )}
    >
      {result.coinSide === CoinSide.HEADS ? (
        <img
          src={`${CDN_URL}/coin-flip-2d/eth.png`}
          width={20}
          height={20}
          alt="eth_icon"
        />
      ) : (
        <img
          src={`${CDN_URL}/coin-flip-2d/btc.png`}
          width={20}
          height={20}
          alt="sol_icon"
        />
      )}
      <div className="wr-ml-1 wr-text-zinc-100">
        {result.coinSide === CoinSide.HEADS ? "ETH" : "BTC"}
      </div>
    </div>
  );
};

export const CoinFlipLastBets: React.FC = () => {
  const { lastBets } = useCoinFlipGameStore(["lastBets"]);

  return (
    <section className="wr-absolute wr-left-1/2 wr-top-5 wr-flex wr-max-w-[375px] wr--translate-x-1/2 wr-items-center wr-justify-end wr-gap-[6px] wr-overflow-hidden wr-max-md:scale-75">
      {lastBets?.map((result, index) => {
        return <LastBet result={result} key={index} />;
      })}
    </section>
  );
};
