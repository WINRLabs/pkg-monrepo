"use client";

import { MinesGameResult, MinesTemplate } from "@winrlabs/games";
import { MinesTemplateWithWeb3 } from "@winrlabs/web3-games";
import React, { useState } from "react";

const MinesPage = () => {
  const [results, setResults] = useState<MinesGameResult[]>([]);
  return (
    <div>
      <MinesTemplateWithWeb3
        maxWager={100}
        minWager={1}
        onAnimationCompleted={() => {
          setResults([]);
          console.log("game completed");
        }}
      />
    </div>
  );
};

export default MinesPage;
