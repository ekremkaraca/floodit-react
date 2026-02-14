import { describe, expect, test } from 'bun:test';
import type { Board } from '../../src/types/game';
import {
  AUTO_GENERATE_SEED,
  DIFFICULTIES,
  calculateMaxSteps,
  flood,
  getStepsLeft,
  initializeBoard,
  initializeCustomBoard,
  initializeMazeBoard,
  isAllFilled,
  isBoardWon,
  isGoalReached,
} from '../../src/utils/gameUtils';

describe('utils/gameUtils', () => {
  test('DIFFICULTIES includes standard presets and custom sentinel', () => {
    expect(DIFFICULTIES).toEqual([
      { name: 'Easy', rows: 6, columns: 6, maxSteps: 15, mode: 'classic' },
      { name: 'Normal', rows: 10, columns: 10, maxSteps: 20, mode: 'classic' },
      { name: 'Hard', rows: 14, columns: 14, maxSteps: 25, mode: 'classic' },
      { name: 'Maze Easy', rows: 10, columns: 10, maxSteps: 22, mode: 'maze' },
      { name: 'Maze Normal', rows: 12, columns: 12, maxSteps: 24, mode: 'maze' },
      { name: 'Maze Hard', rows: 14, columns: 14, maxSteps: 28, mode: 'maze' },
      { name: 'Custom', rows: 0, columns: 0 },
    ]);
  });

  test('initializeBoard is deterministic with explicit seed', () => {
    const boardA = initializeBoard('Easy', 6, 6, 1234, 15);
    const boardB = initializeBoard('Easy', 6, 6, 1234, 15);

    expect(boardA.seed).toBe(1234);
    expect(boardB.seed).toBe(1234);
    expect(boardA.matrix).toEqual(boardB.matrix);
    expect(boardA.maxSteps).toBe(15);
  });

  test('initializeBoard auto-calculates max steps when maxSteps=0', () => {
    const board = initializeBoard('Auto', 10, 10, 1234, 0);
    expect(board.maxSteps).toBe(calculateMaxSteps(board));
  });

  test('initializeBoard generates numeric seed for AUTO_GENERATE_SEED', () => {
    const board = initializeBoard('Easy', 6, 6, AUTO_GENERATE_SEED, 15);
    expect(typeof board.seed).toBe('number');
    expect(Number.isFinite(board.seed)).toBe(true);
  });

  test('initializeCustomBoard uses boardSize and moveLimit', () => {
    const board = initializeCustomBoard(
      { gameMode: 'classic', boardSize: 8, customMoveLimit: true, moveLimit: 30 },
      777,
    );

    expect(board.name).toBe('Custom');
    expect(board.rows).toBe(8);
    expect(board.columns).toBe(8);
    expect(board.maxSteps).toBe(30);
    expect(board.seed).toBe(777);
  });

  test('initializeCustomBoard supports maze mode', () => {
    const board = initializeCustomBoard(
      { gameMode: 'maze', boardSize: 9, customMoveLimit: true, moveLimit: 40 },
      321,
    );

    expect(board.name).toBe('Custom Maze');
    expect(board.mode).toBe('maze');
    expect(board.rows).toBe(9);
    expect(board.columns).toBe(9);
    expect(board.maxSteps).toBe(40);
    expect(board.goal).toEqual({ row: 8, column: 8 });
    expect(board.walls).toBeDefined();
  });

  test('flood returns original board when selecting same color', () => {
    const board: Board = {
      name: 'Test',
      seed: 1,
      rows: 2,
      columns: 2,
      step: 3,
      maxSteps: 10,
      matrix: [
        ['blue', 'green'],
        ['red', 'yellow'],
      ],
    };

    const next = flood(board, 'blue');
    expect(next).toBe(board);
  });

  test('flood applies fill and increments step', () => {
    const board: Board = {
      name: 'Test',
      seed: 1,
      rows: 3,
      columns: 3,
      step: 0,
      maxSteps: 10,
      matrix: [
        ['blue', 'blue', 'green'],
        ['blue', 'red', 'green'],
        ['yellow', 'red', 'green'],
      ],
    };

    const next = flood(board, 'red');

    expect(next).not.toBe(board);
    expect(next.step).toBe(1);
    expect(next.matrix).toEqual([
      ['red', 'red', 'green'],
      ['red', 'red', 'green'],
      ['yellow', 'red', 'green'],
    ]);
    expect(board.matrix[0][0]).toBe('blue');
  });

  test('isAllFilled and getStepsLeft reflect board state', () => {
    const complete: Board = {
      name: 'Done',
      seed: 1,
      rows: 2,
      columns: 2,
      step: 4,
      maxSteps: 10,
      matrix: [
        ['green', 'green'],
        ['green', 'green'],
      ],
    };

    const incomplete: Board = {
      ...complete,
      matrix: [
        ['green', 'green'],
        ['green', 'red'],
      ],
    };

    expect(isAllFilled(complete)).toBe(true);
    expect(isAllFilled(incomplete)).toBe(false);
    expect(getStepsLeft(complete)).toBe(6);
  });

  test('initializeMazeBoard creates deterministic walls and goal', () => {
    const boardA = initializeMazeBoard('Maze', 8, 8, 2222, 18);
    const boardB = initializeMazeBoard('Maze', 8, 8, 2222, 18);

    expect(boardA.mode).toBe('maze');
    expect(boardA.goal).toEqual({ row: 7, column: 7 });
    expect(boardA.walls).toEqual(boardB.walls);
    expect(boardA.walls?.[0][0]).toBe(false);
    expect(boardA.walls?.[7][7]).toBe(false);
  });

  test('initializeMazeBoard guarantees structural path from start to goal', () => {
    const board = initializeMazeBoard('Maze', 12, 12, 2026, 24);
    const unifiedColor = board.matrix[0][0];
    const normalized = {
      ...board,
      matrix: Array.from({ length: board.rows }, () =>
        Array(board.columns).fill(unifiedColor),
      ),
    };

    expect(isGoalReached(normalized)).toBe(true);
  });

  test('flood does not pass through wall cells', () => {
    const board: Board = {
      name: 'Maze',
      mode: 'maze',
      seed: 1,
      rows: 2,
      columns: 2,
      step: 0,
      maxSteps: 10,
      matrix: [
        ['blue', 'blue'],
        ['blue', 'blue'],
      ],
      walls: [
        [false, true],
        [false, false],
      ],
      goal: { row: 1, column: 1 },
    };

    const next = flood(board, 'red');
    expect(next.matrix).toEqual([
      ['red', 'blue'],
      ['red', 'red'],
    ]);
  });

  test('isGoalReached and isBoardWon support maze objective', () => {
    const wonBoard: Board = {
      name: 'Maze',
      mode: 'maze',
      seed: 1,
      rows: 2,
      columns: 2,
      step: 0,
      maxSteps: 10,
      matrix: [
        ['red', 'red'],
        ['blue', 'red'],
      ],
      walls: [
        [false, false],
        [true, false],
      ],
      goal: { row: 1, column: 1 },
    };

    const notWonBoard: Board = {
      ...wonBoard,
      matrix: [
        ['red', 'blue'],
        ['blue', 'red'],
      ],
    };

    expect(isGoalReached(wonBoard)).toBe(true);
    expect(isGoalReached(notWonBoard)).toBe(false);
    expect(isBoardWon(wonBoard)).toBe(true);
    expect(isBoardWon(notWonBoard)).toBe(false);
  });
});
