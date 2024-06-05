import * as Progress from "@radix-ui/react-progress";
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useDevicePixelRatio } from "../../../../hooks/use-device-pixel-ratio";
import { useListenUnityEvent } from "../../../../hooks/use-listen-unity-event";
import { useEqualizeUnitySound } from "../../../../hooks/use-unity-sound";
import { toFormatted } from "../../../../utils/web3";
import useHorseRaceGameStore from "../../store";
import { HorseRaceStatus } from "../../constants";

const UnityFinalizedEvent = "HR_GameEnd";

type SceneProps = {
  onComplete?: () => void;
  buildedGameUrl: string;
};

export const RacingScene = ({ onComplete, buildedGameUrl }: SceneProps) => {
  const devicePixelRatio = useDevicePixelRatio();

  const { status, winnerHorse, resetSelectedHorse } = useHorseRaceGameStore([
    "status",
    "winnerHorse",
    "resetSelectedHorse",
  ]);

  const percentageRef = React.useRef(0);

  const {
    sendMessage,
    isLoaded,
    loadingProgression,
    unityProvider,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    loaderUrl: `${buildedGameUrl || ""}/HorseRacing.loader.js`,
    dataUrl: `${buildedGameUrl || ""}/HorseRacing.data.unityweb`,
    frameworkUrl: `${buildedGameUrl || ""}/HorseRacing.framework.js.unityweb`,
    codeUrl: `${buildedGameUrl || ""}/HorseRacing.wasm.unityweb`,
  });

  useEqualizeUnitySound({
    sendMessage,
  });

  React.useEffect(() => {
    return () => {
      detachAndUnloadImmediate();
    };
  }, [detachAndUnloadImmediate]);

  const { unityEvent } = useListenUnityEvent();

  const startRace = () =>
    sendMessage("WebGLHandler", "ReceiveMessage", "StartRace");

  const finishRace = (winningHorse: number) => {
    sendMessage("WebGLHandler", "ReceiveMessage", `WinnerList|${winningHorse}`);
  };

  React.useEffect(() => {
    if (isLoaded && status === HorseRaceStatus.Race) {
      startRace();
    }

    if (winnerHorse !== undefined && status === HorseRaceStatus.Finished) {
      finishRace(Number(winnerHorse) - 1);
    }
  }, [status, winnerHorse]);

  React.useEffect(() => {
    if (unityEvent.name === UnityFinalizedEvent) {
      onComplete && onComplete();

      setTimeout(() => {
        resetSelectedHorse();

        sendMessage("WebGLHandler", "ReceiveMessage", "Reset");
      }, 3000);
    }
  }, [unityEvent]);

  React.useEffect(() => {
    percentageRef.current = loadingProgression * 100;
  }, [loadingProgression]);

  return (
    <>
      {percentageRef.current !== 100 && (
        <div className="absolute left-0 top-0 z-[100] flex h-[276px] w-full flex-col items-center justify-center gap-4 md:h-full">
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
            {toFormatted(percentageRef.current, 2)} %
          </span>
          <Progress.Root
            className="radius-[1000px] relative z-50 h-[25px] w-[320px] overflow-hidden rounded-md bg-black"
            style={{
              transform: "translateZ(0)",
            }}
            value={percentageRef.current}
          >
            <Progress.Indicator
              className="h-full w-full bg-gradient-to-t from-unity-horse-race-blue-400 to-unity-horse-race-blue-600"
              style={{
                transform: `translateX(-${100 - percentageRef.current}%)`,
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
      <Unity
        unityProvider={unityProvider}
        devicePixelRatio={devicePixelRatio}
        className="h-[276px] w-full rounded-md bg-zinc-900 md:h-full"
      />
    </>
  );
};
