import { create } from "zustand";
import { initialBoard } from "../constant";
import {
  MINES_GAME_STATUS,
  MINES_SUBMIT_TYPE,
  MinesGameResult,
} from "../types";

interface MinesGameState {
  gameStatus: MINES_GAME_STATUS;
  submitType: MINES_SUBMIT_TYPE;
  board: typeof initialBoard;
  currentAnimationCount: number;
  minesGameResults: MinesGameResult[];
}

interface MinesGameStateActions {
  updateMinesGameState: (state: Partial<MinesGameState>) => void;
  updateBoardItem: (boardId: number, input: (typeof initialBoard)[0]) => void;
  updateCurrentAnimationCount: (count: number) => void;
  updateMinesGameResults: (item: MinesGameResult[]) => void;
  updateGameStatus: (status: MINES_GAME_STATUS) => void;
}

type MinesGameStateStore = MinesGameState & MinesGameStateActions;

const useMinesGameStateStore = create<MinesGameStateStore>()((set) => ({
  gameStatus: MINES_GAME_STATUS.IDLE,
  submitType: MINES_SUBMIT_TYPE.IDLE,
  currentAnimationCount: 0,
  board: initialBoard,
  minesGameResults: [],
  updateMinesGameResults: (item) => set(() => ({ minesGameResults: item })),
  updateMinesGameState: (input) => set((state) => ({ ...state, ...input })),
  updateGameStatus: (status) => set(() => ({ gameStatus: status })),
  updateBoardItem: (boardId, input) =>
    set((state) => {
      const board = [...state.board];

      board[boardId] = input;

      return { ...state, board };
    }),
  updateCurrentAnimationCount: (count) =>
    set(() => ({ currentAnimationCount: count })),
}));

export { useMinesGameStateStore };
