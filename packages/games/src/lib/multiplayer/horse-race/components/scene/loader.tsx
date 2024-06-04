"use client";

import React, { Ref } from "react";
import * as Progress from "@radix-ui/react-progress";

export const SceneLoader = ({ percentage }: { percentage: number }) => {
  return (
    <>
      {percentage !== 100 && (
        <div className="absolute left-0 top-0 z-[5] flex h-full w-full flex-col items-center justify-center gap-4">
          <img
            src={"/images/horse-race/loader.png"}
            alt="loader"
            className="absolute left-0 top-0 z-[5] h-full w-full rounded-md"
          />
          <span
            style={{
              textShadow: "0 0 5px black, 0 0 5px black",
            }}
            className="z-50 text-2xl font-bold text-white"
          >
            {percentage} %
          </span>
          <Progress.Root
            className="radius-[1000px] relative z-50 h-[25px] w-[320px] overflow-hidden rounded-md bg-black"
            style={{
              transform: "translateZ(0)",
            }}
            value={percentage}
          >
            <Progress.Indicator
              className="h-full w-full bg-gradient-to-t from-unity-horse-race-blue-400 to-unity-horse-race-blue-600"
              style={{
                transform: `translateX(-${100 - percentage}%)`,
                transition: "transform 660ms cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            />
          </Progress.Root>
          <span
            style={{
              textShadow: "0 0 5px black, 0 0 5px black",
            }}
            className="z-50 text-2xl font-bold text-white"
          >
            Horse Race
          </span>
        </div>
      )}
    </>
  );
};
