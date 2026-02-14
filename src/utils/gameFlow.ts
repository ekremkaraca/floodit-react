import type { Board, CustomGameSettings, Difficulty } from '../types/game';
import { flood, getStepsLeft, isAllFilled } from './gameUtils';

export type MoveResult = {
  success: boolean;
  gameState: 'playing' | 'won' | 'lost' | null;
};

export type MoveResolution = {
  result: MoveResult;
  nextBoard: Board | null;
};

export type LastGameConfig =
  | { type: 'difficulty'; difficulty: Difficulty }
  | { type: 'custom'; settings: CustomGameSettings }
  | null;

export type RoundStartTarget =
  | { type: 'difficulty'; difficulty: Difficulty }
  | { type: 'custom'; settings: CustomGameSettings }
  | null;

export function resolveMove(board: Board | null, colorName: string): MoveResolution {
  if (!board || getStepsLeft(board) < 1) {
    return {
      nextBoard: board,
      result: { success: false, gameState: 'lost' },
    };
  }

  if (board.matrix[0][0] === colorName) {
    return {
      nextBoard: board,
      result: { success: false, gameState: null },
    };
  }

  const nextBoard = flood(board, colorName);

  if (isAllFilled(nextBoard)) {
    return {
      nextBoard,
      result: { success: true, gameState: 'won' },
    };
  }

  if (getStepsLeft(nextBoard) < 1) {
    return {
      nextBoard,
      result: { success: true, gameState: 'lost' },
    };
  }

  return {
    nextBoard,
    result: { success: true, gameState: 'playing' },
  };
}

export function resolveRoundStartTarget(
  lastGameConfig: LastGameConfig,
  board: Board | null
): RoundStartTarget {
  if (lastGameConfig?.type === 'difficulty') {
    return { type: 'difficulty', difficulty: lastGameConfig.difficulty };
  }

  if (lastGameConfig?.type === 'custom') {
    return { type: 'custom', settings: lastGameConfig.settings };
  }

  if (board) {
    return {
      type: 'difficulty',
      difficulty: {
        name: board.name,
        rows: board.rows,
        columns: board.columns,
        maxSteps: board.maxSteps,
      },
    };
  }

  return null;
}
