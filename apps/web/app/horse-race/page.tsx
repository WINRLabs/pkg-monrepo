"use client";

import { HorseRaceTemplate } from "@winrlabs/games";
import { useState } from "react";

export default function HorseRacePage() {
  const [results, setResults] = useState<any[]>([]);

  return (
    <HorseRaceTemplate
      maxWager={100}
      minWager={1}
      currentAccount="asd"
      options={{
        scene: {
          loader: "/coin-flip-3d/loader.png",
        },
        controller: {
          logo: "/coin-flip-3d/coin-flip-logo.png",
        },
      }}
      history={[]}
      onComplete={() => console.log("complete")}
      onSubmitGameForm={(data) => {
        console.log(data, "data");
        // send request

        // get results

        setResults([
          {
            payout: 1,
            payoutInUsd: 1,
            coinSide: COIN_SIDE.BTC,
          },
          {
            payout: 1,
            payoutInUsd: 1,
            coinSide: COIN_SIDE.ETH,
          },
          {
            payout: 1,
            payoutInUsd: 1,
            coinSide: COIN_SIDE.BTC,
          },
          {
            payout: 1,
            payoutInUsd: 1,
            coinSide: COIN_SIDE.ETH,
          },
        ]);
      }}
      buildedGameUrl={process.env.NEXT_PUBLIC_BASE_CDN_URL || ""}
      onAnimationCompleted={() => {
        setResults([]);
        console.log("game completed");
      }}
      gameResults={results}
    />
  );
}
