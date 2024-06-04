import * as Radio from "@radix-ui/react-radio-group";
import { useFormContext } from "react-hook-form";
import { UnityAudioController } from "../../../common/audio-controller";
import { UnityBetControllerContainer } from "../../../common/containers";
import {
  BetControllerTitle,
  UnityWagerFormField,
} from "../../../common/controller";
import { PreBetButton } from "../../../common/pre-bet-button";
import { WagerCurrencyIcon } from "../../../common/wager";
import useCountdown from "../../../hooks/use-countdown";
import { Button } from "../../../ui/button";
import { CountdownProvider, Minutes, Seconds } from "../../../ui/countdown";
import { FormControl, FormField, FormItem, FormLabel } from "../../../ui/form";
import { cn } from "../../../utils/style";
import { Horse, HorseRaceStatus } from "../constants";
import useHorseRaceGameStore from "../store";
import { HorseRaceForm } from "../types";

interface Props {
  minWager: number;
  maxWager: number;
  maxPayout: number;
  isGamblerParticipant: boolean;
}

export const HorseRaceBetController: React.FC<Props> = ({
  minWager,
  maxWager,
  maxPayout,
  isGamblerParticipant,
}) => {
  const form = useFormContext() as HorseRaceForm;

  const { updateState, startTime, status, finishTime, resetState } =
    useHorseRaceGameStore([
      "finishTime",
      "startTime",
      "status",
      "updateState",
      "resetState",
    ]);

  const selectedHorse = form.watch("horse");

  useCountdown(startTime, () => {
    updateState({ status: HorseRaceStatus.Race });
  });

  const finishTimeLeft = useCountdown(finishTime, () => {
    resetState();
  });

  return (
    <UnityBetControllerContainer className="top-[276px] z-[15] h-full w-full md:top-0 md:w-[264px]">
      <div className="mb-3 flex flex-col">
        <div className="mb-3 hidden md:block">
          <BetControllerTitle>
            <img
              src={"/images/horse-race/horse-race-logo.png"}
              width={140}
              height={60}
              alt="game_logo"
            />
          </BetControllerTitle>
        </div>

        <div className="mb-4 flex flex-col gap-3 max-md:mt-[40px]">
          <span className="text-unity-white-50">Next round in</span>

          {startTime > 0 ? (
            <CountdownProvider
              targetDate={new Date(startTime * 1000)?.toISOString()}
            >
              <section className="flex items-center gap-2">
                <div className="text-[64px] font-bold leading-[64px] text-white max-md:text-[32px] max-md:leading-[32px]">
                  <Minutes />
                </div>
                <div className="text-[64px] font-bold leading-[64px] text-white max-md:text-[32px] max-md:leading-[32px]">
                  :
                </div>
                <div className="text-[64px] font-bold leading-[64px] text-white max-md:text-[32px] max-md:leading-[32px]">
                  <Seconds />
                </div>
              </section>
            </CountdownProvider>
          ) : (
            <span className="text-[64px] font-bold leading-[64px] text-white max-md:text-[32px] max-md:leading-[32px]">
              Waiting...
            </span>
          )}
        </div>

        <UnityWagerFormField
          minWager={minWager}
          maxWager={maxWager}
          className="order-2 md:order-[unset]"
        />

        <FormField
          control={form.control}
          name="horse"
          render={({ field }) => (
            <FormItem className="order-2 md:order-[unset]">
              <FormLabel className="text-unity-white-50">Choose</FormLabel>
              <FormControl>
                <Radio.RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-5 grid-rows-1 gap-[6px]"
                >
                  <FormItem className="mb-0">
                    <FormControl>
                      <Radio.Item
                        className={cn(
                          "h-full w-full rounded-md bg-white/80 py-[10px] text-center text-white transition-all duration-150 hover:text-white",
                          {
                            "bg-white/70 text-white": field.value === Horse.ONE,
                          }
                        )}
                        value={Horse.ONE}
                      >
                        2x
                      </Radio.Item>
                    </FormControl>
                  </FormItem>
                  <FormItem className="mb-0">
                    <FormControl>
                      <Radio.Item
                        className={cn(
                          "h-full w-full rounded-md bg-yellow-400/80 py-[10px] text-center text-yellow-300 transition-all duration-150 hover:text-white",
                          {
                            "bg-yellow-600 text-white":
                              field.value === Horse.TWO,
                          }
                        )}
                        value={Horse.TWO}
                      >
                        3x
                      </Radio.Item>
                    </FormControl>
                  </FormItem>
                  <FormItem className="mb-0">
                    <FormControl>
                      <Radio.Item
                        className={cn(
                          "h-full w-full rounded-md bg-blue-600/70 py-[10px] text-center text-blue-300",
                          {
                            "bg-blue-600 text-white":
                              field.value === Horse.THREE,
                          }
                        )}
                        value={Horse.THREE}
                      >
                        8x
                      </Radio.Item>
                    </FormControl>
                  </FormItem>
                  <FormItem className="mb-0 ">
                    <FormControl>
                      <Radio.Item
                        className={cn(
                          "h-full w-full rounded-md bg-green-500/80 py-[10px] text-center text-green-300",
                          {
                            "bg-green-500 text-white":
                              field.value === Horse.FOUR,
                          }
                        )}
                        value={Horse.FOUR}
                      >
                        15x
                      </Radio.Item>
                    </FormControl>
                  </FormItem>
                  <FormItem className="mb-0 ">
                    <FormControl>
                      <Radio.Item
                        className={cn(
                          "h-full w-full rounded-md bg-red-600/80 py-[10px] text-center text-red-300",
                          {
                            "bg-red-600 text-white": field.value === Horse.FIVE,
                          }
                        )}
                        value={Horse.FIVE}
                      >
                        60x
                      </Radio.Item>
                    </FormControl>
                  </FormItem>
                </Radio.RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="order-2 mb-3 w-full md:order-[unset]">
          <FormLabel className="text-unity-white-50">Max Payout</FormLabel>
          <div
            className={cn(
              "flex w-full items-center gap-1 rounded-lg bg-zinc-800 px-2 py-[10px] ",
              "border border-solid border-unity-white-15 bg-unity-white-15 backdrop-blur-md"
            )}
          >
            <WagerCurrencyIcon />
            <span className={cn("font-semibold text-zinc-100")}>
              ${maxPayout}
            </span>
          </div>
        </div>
        <PreBetButton variant={"horse-race"} className="mb-4 md:mb-0">
          <Button
            type="submit"
            variant={"horse-race"}
            className={cn("order-1 mb-4 w-full md:order-[unset] md:mb-0", {
              "text-sm":
                finishTimeLeft > 0 && status === HorseRaceStatus.Finished,
            })}
            size={"xl"}
            disabled={
              form.formState.isSubmitting ||
              form.formState.isLoading ||
              status === HorseRaceStatus.Race ||
              (finishTimeLeft > 0 && status == HorseRaceStatus.Finished) ||
              isGamblerParticipant ||
              selectedHorse === Horse.IDLE
            }
          >
            {form.formState.isSubmitting || form.formState.isLoading
              ? "Placing bet..."
              : finishTimeLeft > 0 && status === HorseRaceStatus.Finished
                ? `Next game in ${finishTimeLeft} seconds`
                : "Place bet"}
          </Button>
        </PreBetButton>
      </div>
      <footer className="absolute bottom-[14px] left-[14px] mt-auto flex items-center justify-between">
        <UnityAudioController />
      </footer>
    </UnityBetControllerContainer>
  );
};
