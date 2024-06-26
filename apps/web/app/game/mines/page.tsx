"use client";

import { MinesGameResult, MinesTemplate } from "@winrlabs/games";
import React, { useState } from "react";

const MinesPage = () => {
  const [results, setResults] = useState<MinesGameResult[]>([]);
  return (
    <div>
      <MinesTemplate
        maxWager={100}
        minWager={1}
        onSubmitGameForm={(data) => {
          console.log(data, "data");
          // send request

          // get results

          setResults([
            {
              won: true,
              payout: 1,
              payoutInUsd: 1,
              outcome: 2,
            },
            {
              won: true,
              payout: 1,
              payoutInUsd: 1,
              outcome: 23,
            },
            {
              won: true,
              payout: 1,
              payoutInUsd: 1,
              outcome: 12,
            },
            {
              won: true,
              payout: 1,
              payoutInUsd: 1,
              outcome: 0,
            },
          ]);
        }}
        onAnimationCompleted={() => {
          setResults([]);
          console.log("game completed");
        }}
        gameResults={results}
      />
    </div>
  );
};

export default MinesPage;
