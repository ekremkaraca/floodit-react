import type { Board, GameColors, Position, CustomGameSettings } from '../types/game';

export const DEFAULT_COLORS: GameColors[] = [
  { name: 'blue', hex: '#3584e4' },
  { name: 'green', hex: '#33d17a' },
  { name: 'yellow', hex: '#f6d32d' },
  { name: 'orange', hex: '#ff7800' },
  { name: 'red', hex: '#ed333b' },
  { name: 'purple', hex: '#9141ac' },
];

export const DIFFICULTIES = [
  { name: 'Easy', rows: 6, columns: 6, maxSteps: 15 },
  { name: 'Normal', rows: 10, columns: 10, maxSteps: 20 },
  { name: 'Hard', rows: 14, columns: 14, maxSteps: 25 },
  { name: 'Custom', rows: 0, columns: 0 },
];

export function createDefaultBoard(): Board {
  return {
    name: 'Custom',
    seed: 0,
    rows: 0,
    columns: 0,
    step: 0,
    maxSteps: 1,
    matrix: [],
  };
}

export function initializeBoard(
  name: string,
  rows: number,
  columns: number,
  seed: number = 0,
  maxSteps: number = 0
): Board {
  const matrix: string[][] = Array(rows).fill(null).map(() => Array(columns).fill(''));
  
  const availableColors = DEFAULT_COLORS.map(color => color.name);
  
  if (seed === 0) {
    seed = Date.now();
  }

  // Simple random number generator
  let random = seed;
  function rand(): number {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const colorIndex = Math.floor(rand() * availableColors.length);
      matrix[row][col] = availableColors[colorIndex];
    }
  }

  const board: Board = {
    name,
    seed,
    rows,
    columns,
    step: 0,
    matrix,
    maxSteps: maxSteps,
  };

  if (maxSteps === 0) {
    board.maxSteps = calculateMaxSteps(board);
  }

  return board;
}

function getNeighbors(board: Board, pos: Position): Position[] {
  const { row, column } = pos;
  const { rows, columns } = board;
  const neighbors: Position[] = [];

  // Up
  if (row > 0) {
    neighbors.push({ row: row - 1, column });
  }

  // Left
  if (column > 0) {
    neighbors.push({ row, column: column - 1 });
  }

  // Down
  if (row < rows - 1) {
    neighbors.push({ row: row + 1, column });
  }

  // Right
  if (column < columns - 1) {
    neighbors.push({ row, column: column + 1 });
  }

  return neighbors;
}

export function flood(board: Board, newColor: string): Board {
  const newBoard = { ...board };
  const newMatrix = board.matrix.map(row => [...row]);
  
  const targetColor = newMatrix[0][0];
  if (targetColor === newColor) {
    return board;
  }

  const queue: Position[] = [{ row: 0, column: 0 }];
  newMatrix[0][0] = newColor;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = getNeighbors(board, current);

    for (const pos of neighbors) {
      if (newMatrix[pos.row][pos.column] === targetColor) {
        newMatrix[pos.row][pos.column] = newColor;
        queue.push(pos);
      }
    }
  }

  newBoard.matrix = newMatrix;
  newBoard.step++;
  
  return newBoard;
}

export function initializeCustomBoard(settings: CustomGameSettings, seed: number = 0): Board {
  return initializeBoard(
    'Custom',
    settings.boardSize,
    settings.boardSize,
    seed,
    settings.moveLimit
  );
}

export function getStepsLeft(board: Board): number {
  return board.maxSteps - board.step;
}

export function calculateMaxSteps(board: Board): number {
  // Formula from original game: 30 * (rows * colors) / (17 * 6)
  return Math.floor(30 * (board.rows * DEFAULT_COLORS.length) / (17 * 6));
}

export function isAllFilled(board: Board): boolean {
  const targetColor = board.matrix[0][0];
  
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.columns; col++) {
      if (board.matrix[row][col] !== targetColor) {
        return false;
      }
    }
  }
  
  return true;
}
