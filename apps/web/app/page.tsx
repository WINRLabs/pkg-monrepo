"use client";

import { Dice } from "@winrlabs/games";
import { useState } from "react";

export default function Home() {
  const [results, setResults] = useState();

  return (
    <div style={{ width: 500, height: 400 }}>
      <Dice.Game results={results}>
        <Dice.Body>
          <Dice.TextRandomizer />
          <Dice.Slider />
        </Dice.Body>
        <Dice.Controller winMultiplier={32} />
      </Dice.Game>
      <button
        style={{ marginTop: 400 }}
        onClick={() => {
          setResults([
            {
              payout: 0,
              payoutInUsd: 0,
              resultNumber: 30,
            },
            {
              payout: 2,
              payoutInUsd: 2,
              resultNumber: 49,
            },
            {
              payout: 0,
              payoutInUsd: 0,
              resultNumber: 10,
            },
          ]);
        }}
      >
        xd
      </button>
    </div>
  );
}
