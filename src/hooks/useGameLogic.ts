import { useState, useCallback } from 'react';
import type { Board, Difficulty, CustomGameSettings } from '../types/game';
import {
  initializeBoard,
  initializeCustomBoard,
  getStepsLeft,
  isAllFilled,
  AUTO_GENERATE_SEED,
  DEFAULT_COLORS,
} from '../utils/gameUtils';
import { resolveMove } from '../utils/gameFlow';

export function useGameLogic() {
  const [board, setBoard] = useState<Board | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');

  const startNewGame = useCallback((
    difficulty: Difficulty,
    seed: number = AUTO_GENERATE_SEED
  ) => {
    const newBoard = initializeBoard(
      difficulty.name,
      difficulty.rows,
      difficulty.columns,
      seed,
      difficulty.maxSteps || 0
    );
    setBoard(newBoard);
    setSelectedColor('');
  }, []);

  const makeMove = useCallback((colorName: string) => {
    const { nextBoard, result } = resolveMove(board, colorName);
    if (nextBoard !== board) {
      setBoard(nextBoard);
    }
    return result;
  }, [board]);

  const startCustomGame = useCallback((
    settings: CustomGameSettings,
    seed: number = AUTO_GENERATE_SEED
  ) => {
    const newBoard = initializeCustomBoard(settings, seed);
    setBoard(newBoard);
    setSelectedColor('');
  }, []);

  const resetGame = useCallback(() => {
    if (!board) return;
    
    const newBoard = initializeBoard(
      board.name,
      board.rows,
      board.columns,
      AUTO_GENERATE_SEED,
      board.maxSteps
    );
    setBoard(newBoard);
    setSelectedColor('');
  }, [board]);

  const quitGame = useCallback(() => {
    setBoard(null);
    setSelectedColor('');
  }, []);

  const stepsLeft = board ? getStepsLeft(board) : 0;
  const isGameOver = board ? (isAllFilled(board) || stepsLeft < 1) : false;
  const hasWon = board ? isAllFilled(board) : false;

  return {
    board,
    selectedColor,
    setSelectedColor,
    startNewGame,
    startCustomGame,
    makeMove,
    resetGame,
    quitGame,
    stepsLeft,
    isGameOver,
    hasWon,
    availableColors: DEFAULT_COLORS,
  };
}
