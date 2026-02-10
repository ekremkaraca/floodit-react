export interface Position {
  row: number;
  column: number;
}

export interface Board {
  name: string;
  seed: number;
  rows: number;
  columns: number;
  step: number;
  maxSteps: number;
  matrix: string[][];
}

export interface GameColors {
  name: string;
  hex: string;
}

export type GameState = 'welcome' | 'playing' | 'won' | 'lost';

export interface Difficulty {
  name: string;
  rows: number;
  columns: number;
  maxSteps?: number;
}

export interface CustomGameSettings {
  boardSize: number;
  customMoveLimit: boolean;
  moveLimit: number;
}
