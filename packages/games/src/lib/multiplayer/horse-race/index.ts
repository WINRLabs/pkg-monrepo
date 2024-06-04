import { BetController } from "../../solo/dice/components/bet-controller";
import { HorseRaceGame } from "./components/game";
import HorseDetail from "./components/horse-detail";
import { LastBets } from "./components/last-bets";
import { RacingScene } from "./components/scene";
import { SceneLoader } from "./components/scene/loader";
import SelectedHorseDetail from "./components/selected-horse-detail";
import { HorseRaceTemplate } from "./components/template";

export const HorseRace = {
  Game: HorseRaceGame,
  SelectedHorseDetail,
  LastBets,
  Scene: RacingScene,
  Detail: HorseDetail,
  BetController,
  SceneLoader,
  Template: HorseRaceTemplate,
};

export * from "./store";

export * from "./types";

export * from "./constants";
