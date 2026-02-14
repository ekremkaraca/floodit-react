import type { Board, GameColors, Position, CustomGameSettings, Difficulty } from '../types/game';

export const AUTO_GENERATE_SEED = 0;

export const DEFAULT_COLORS: GameColors[] = [
  { name: 'blue', hex: '#3584e4' },
  { name: 'green', hex: '#33d17a' },
  { name: 'yellow', hex: '#f6d32d' },
  { name: 'orange', hex: '#ff7800' },
  { name: 'red', hex: '#ed333b' },
  { name: 'purple', hex: '#9141ac' },
];

export const DIFFICULTIES: Difficulty[] = [
  { name: 'Easy', rows: 6, columns: 6, maxSteps: 15, mode: 'classic' },
  { name: 'Normal', rows: 10, columns: 10, maxSteps: 20, mode: 'classic' },
  { name: 'Hard', rows: 14, columns: 14, maxSteps: 25, mode: 'classic' },
  { name: 'Maze Easy', rows: 10, columns: 10, maxSteps: 22, mode: 'maze' },
  { name: 'Maze Normal', rows: 12, columns: 12, maxSteps: 24, mode: 'maze' },
  { name: 'Maze Hard', rows: 14, columns: 14, maxSteps: 28, mode: 'maze' },
  { name: 'Custom', rows: 0, columns: 0 },
];

export function createDefaultBoard(): Board {
  return {
    name: 'Custom',
    seed: AUTO_GENERATE_SEED,
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
  seed: number = AUTO_GENERATE_SEED,
  maxSteps: number = 0
): Board {
  const matrix: string[][] = Array(rows).fill(null).map(() => Array(columns).fill(''));
  
  const availableColors = DEFAULT_COLORS.map(color => color.name);
  
  if (seed === AUTO_GENERATE_SEED) {
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
    mode: 'classic',
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

function createMazeWalls(rows: number, columns: number, rand: () => number): boolean[][] {
  const walls = Array.from({ length: rows }, () => Array(columns).fill(true));
  const stack: Position[] = [{ row: 0, column: 0 }];
  walls[0][0] = false;

  const directions = [
    { dr: -2, dc: 0 },
    { dr: 2, dc: 0 },
    { dr: 0, dc: -2 },
    { dr: 0, dc: 2 },
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const candidates: Array<{ nextRow: number; nextColumn: number; midRow: number; midColumn: number }> = [];

    for (const { dr, dc } of directions) {
      const nextRow = current.row + dr;
      const nextColumn = current.column + dc;
      if (nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns) {
        continue;
      }
      if (!walls[nextRow][nextColumn]) {
        continue;
      }

      candidates.push({
        nextRow,
        nextColumn,
        midRow: current.row + dr / 2,
        midColumn: current.column + dc / 2,
      });
    }

    if (candidates.length === 0) {
      stack.pop();
      continue;
    }

    const pick = candidates[Math.floor(rand() * candidates.length)];
    walls[pick.midRow][pick.midColumn] = false;
    walls[pick.nextRow][pick.nextColumn] = false;
    stack.push({ row: pick.nextRow, column: pick.nextColumn });
  }

  // Ensure goal cell is open and connected back to start.
  let row = rows - 1;
  let column = columns - 1;
  walls[row][column] = false;
  while (row !== 0 || column !== 0) {
    walls[row][column] = false;
    const canMoveUp = row > 0;
    const canMoveLeft = column > 0;

    if (canMoveUp && canMoveLeft) {
      if (rand() < 0.5) {
        row -= 1;
      } else {
        column -= 1;
      }
    } else if (canMoveUp) {
      row -= 1;
    } else {
      column -= 1;
    }

    walls[row][column] = false;
  }

  return walls;
}

export function initializeMazeBoard(
  name: string,
  rows: number,
  columns: number,
  seed: number = AUTO_GENERATE_SEED,
  maxSteps: number = 0
): Board {
  const board = initializeBoard(name, rows, columns, seed, maxSteps);

  let random = board.seed;
  function rand(): number {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  }

  return {
    ...board,
    mode: 'maze',
    walls: createMazeWalls(rows, columns, rand),
    goal: { row: rows - 1, column: columns - 1 },
  };
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

  const visited = Array.from({ length: board.rows }, () =>
    Array(board.columns).fill(false)
  );
  const queue: Position[] = [{ row: 0, column: 0 }];
  visited[0][0] = true;
  newMatrix[0][0] = newColor;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = getNeighbors(board, current);

    for (const pos of neighbors) {
      if (visited[pos.row][pos.column]) {
        continue;
      }
      if (board.walls?.[pos.row]?.[pos.column]) {
        continue;
      }

      const cellColor = newMatrix[pos.row][pos.column];
      if (cellColor === targetColor || cellColor === newColor) {
        visited[pos.row][pos.column] = true;
        newMatrix[pos.row][pos.column] = newColor;
        queue.push(pos);
      }
    }
  }

  newBoard.matrix = newMatrix;
  newBoard.step++;
  
  return newBoard;
}

export function initializeCustomBoard(
  settings: CustomGameSettings,
  seed: number = AUTO_GENERATE_SEED
): Board {
  if (settings.gameMode === 'maze') {
    return initializeMazeBoard(
      'Custom Maze',
      settings.boardSize,
      settings.boardSize,
      seed,
      settings.moveLimit
    );
  }

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

export function isGoalReached(board: Board): boolean {
  if (!board.goal) return false;
  const { row: goalRow, column: goalColumn } = board.goal;
  if (
    goalRow < 0 ||
    goalRow >= board.rows ||
    goalColumn < 0 ||
    goalColumn >= board.columns
  ) {
    return false;
  }

  const targetColor = board.matrix[0][0];
  const visited = Array.from({ length: board.rows }, () =>
    Array(board.columns).fill(false)
  );
  const queue: Position[] = [{ row: 0, column: 0 }];
  let queueIndex = 0;
  visited[0][0] = true;

  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];
    if (current.row === goalRow && current.column === goalColumn) {
      return true;
    }

    const neighbors = getNeighbors(board, current);
    for (const pos of neighbors) {
      if (visited[pos.row][pos.column]) continue;
      if (board.walls?.[pos.row]?.[pos.column]) continue;
      if (board.matrix[pos.row][pos.column] !== targetColor) continue;

      visited[pos.row][pos.column] = true;
      queue.push(pos);
    }
  }

  return false;
}

export function isBoardWon(board: Board): boolean {
  if (board.mode === 'maze' || board.goal) {
    return isGoalReached(board);
  }
  return isAllFilled(board);
}
