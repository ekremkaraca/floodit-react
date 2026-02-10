import { useState, useCallback } from 'react';
import type { Board, Difficulty, CustomGameSettings } from '../types/game';
import {
  initializeBoard,
  initializeCustomBoard,
  flood,
  getStepsLeft,
  isAllFilled,
  DEFAULT_COLORS,
} from '../utils/gameUtils';

export function useGameLogic() {
  const [board, setBoard] = useState<Board | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');

  const startNewGame = useCallback((
    difficulty: Difficulty,
    seed: number = 0
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
    if (!board || getStepsLeft(board) < 1) {
      return { success: false, gameState: 'lost' as const };
    }

    if (board.matrix[0][0] === colorName) {
      return { success: false, gameState: null };
    }

    const newBoard = flood(board, colorName);
    setBoard(newBoard);

    if (isAllFilled(newBoard)) {
      return { success: true, gameState: 'won' as const };
    }

    if (getStepsLeft(newBoard) < 1) {
      return { success: true, gameState: 'lost' as const };
    }

    return { success: true, gameState: 'playing' as const };
  }, [board]);

  const startCustomGame = useCallback((
    settings: CustomGameSettings,
    seed: number = 0
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
      board.seed,
      board.maxSteps
    );
    setBoard(newBoard);
    setSelectedColor('');
  }, [board]);

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
    stepsLeft,
    isGameOver,
    hasWon,
    availableColors: DEFAULT_COLORS,
  };
}
