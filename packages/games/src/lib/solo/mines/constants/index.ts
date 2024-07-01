/*
 * FUNCTIONS: FIRST_REVEAL , REVEAL, FIRST_REVEAL_AND_CASHOUT, CASHOUT
 */

export const boardsSchema = [
  {
    mines: 1,
    maxReveal: 24,
    multiplier: 247500,
  },
  {
    mines: 2,
    maxReveal: 21,
    multiplier: 495000,
  },
  {
    mines: 3,
    maxReveal: 17,
    multiplier: 406607,
  },
  {
    mines: 4,
    maxReveal: 14,
    multiplier: 379500,
  },
  {
    mines: 5,
    maxReveal: 12,
    multiplier: 408692,
  },
  {
    mines: 6,
    maxReveal: 10,
    multiplier: 350307,
  },
  {
    mines: 7,
    maxReveal: 9,
    multiplier: 415990,
  },
  {
    mines: 8,
    maxReveal: 8,
    multiplier: 440460,
  },
  {
    mines: 9,
    maxReveal: 7,
    multiplier: 415990,
  },
  {
    mines: 10,
    maxReveal: 6,
    multiplier: 350307,
  },
  {
    mines: 11,
    maxReveal: 5,
    multiplier: 262730,
  },
  {
    mines: 12,
    maxReveal: 5,
    multiplier: 408692,
  },
  {
    mines: 13,
    maxReveal: 4,
    multiplier: 253000,
  },
  {
    mines: 14,
    maxReveal: 4,
    multiplier: 379500,
  },
  {
    mines: 15,
    maxReveal: 3,
    multiplier: 189750,
  },
  {
    mines: 16,
    maxReveal: 3,
    multiplier: 271071,
  },
  {
    mines: 17,
    maxReveal: 3,
    multiplier: 406607,
  },
  {
    mines: 18,
    maxReveal: 2,
    multiplier: 141428,
  },
  {
    mines: 19,
    maxReveal: 2,
    multiplier: 198000,
  },
  {
    mines: 20,
    maxReveal: 2,
    multiplier: 297000,
  },
  {
    mines: 21,
    maxReveal: 2,
    multiplier: 495000,
  },
  {
    mines: 22,
    maxReveal: 1,
    multiplier: 82500,
  },
  {
    mines: 23,
    maxReveal: 1,
    multiplier: 123750,
  },
  {
    mines: 24,
    maxReveal: 1,
    multiplier: 247500,
  },
] as const;

export const initialBoard = [
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
  {
    isSelected: false,
    isBomb: false,
    isRevealed: false,
  },
];

export const MAX_MINE_AMOUNT = 24;
