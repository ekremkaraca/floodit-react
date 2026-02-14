export type GameMode = 'classic' | 'maze';

export interface Position {
  row: number;
  column: number;
}

export interface Board {
  name: string;
  mode?: GameMode;
  seed: number;
  rows: number;
  columns: number;
  step: number;
  maxSteps: number;
  matrix: string[][];
  walls?: boolean[][];
  goal?: Position;
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
  mode?: GameMode;
}

export interface CustomGameSettings {
  gameMode: GameMode;
  boardSize: number;
  customMoveLimit: boolean;
  moveLimit: number;
}
