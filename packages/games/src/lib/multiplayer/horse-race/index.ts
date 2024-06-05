import { HorseRaceGame } from "./components/game";
import HorseDetail from "./components/horse-detail";
import { LastBets } from "./components/last-bets";
import { RacingScene } from "./components/scene";
import { SceneLoader } from "./components/scene/loader";
import SelectedHorseDetail from "./components/selected-horse-detail";
import { HorseRaceTemplate } from "./components/template";
import { HorseRaceBetController } from "./components/bet-controller";

export const HorseRace = {
  Game: HorseRaceGame,
  SelectedHorseDetail,
  LastBets,
  Scene: RacingScene,
  Detail: HorseDetail,
  BetController: HorseRaceBetController,
  SceneLoader,
  Template: HorseRaceTemplate,
};

export * from "./store";

export * from "./types";

export * from "./constants";
