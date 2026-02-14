import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Board } from '../types/game';

interface GameBoardProps {
  board: Board;
}

export function GameBoard({ board }: GameBoardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const updateViewport = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const getColorClass = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-game-blue',
      'green': 'bg-game-green',
      'yellow': 'bg-game-yellow',
      'orange': 'bg-game-orange',
      'red': 'bg-game-red',
      'purple': 'bg-game-purple',
    };
    return colorMap[colorName] || 'bg-gray-400';
  };

  const gridSize = useMemo(() => {
    const isDesktop = viewportSize.width >= 1024;
    const widthFactor = 0.9;
    const heightFactor = isDesktop ? 0.65 : 0.9;

    const viewportWidth = viewportSize.width > 0 ? viewportSize.width * widthFactor : 900;
    const viewportHeight = viewportSize.height > 0 ? viewportSize.height * heightFactor : 900;

    const maxWidth = Math.min(
      containerSize.width > 0 ? containerSize.width : viewportWidth,
      viewportWidth,
      900
    );
    const maxHeight = Math.min(
      containerSize.height > 0 ? containerSize.height : viewportHeight,
      viewportHeight,
      900
    );

    const aspect = board.columns / board.rows;
    let width = maxWidth;
    let height = width / aspect;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspect;
    }

    return {
      width: Math.max(0, Math.floor(width)),
      height: Math.max(0, Math.floor(height)),
    };
  }, [board.columns, board.rows, containerSize.height, containerSize.width, viewportSize.height, viewportSize.width]);

  const floodedMask = useMemo(() => {
    if (board.rows < 1 || board.columns < 1) {
      return [];
    }

    const targetColor = board.matrix[0][0];
    const visited = Array.from({ length: board.rows }, () =>
      Array(board.columns).fill(false)
    );

    const queue = [{ row: 0, column: 0 }];
    let queueIndex = 0;
    visited[0][0] = true;

    while (queueIndex < queue.length) {
      const current = queue[queueIndex++];
      const neighbors = [
        { row: current.row - 1, column: current.column },
        { row: current.row + 1, column: current.column },
        { row: current.row, column: current.column - 1 },
        { row: current.row, column: current.column + 1 },
      ];

      for (const next of neighbors) {
        if (
          next.row < 0 ||
          next.row >= board.rows ||
          next.column < 0 ||
          next.column >= board.columns
        ) {
          continue;
        }
        if (visited[next.row][next.column]) {
          continue;
        }
        if (board.walls?.[next.row]?.[next.column]) {
          continue;
        }
        if (board.matrix[next.row][next.column] !== targetColor) {
          continue;
        }

        visited[next.row][next.column] = true;
        queue.push(next);
      }
    }

    return visited;
  }, [board.columns, board.matrix, board.rows, board.walls]);

  const renderCell = (cellColor: string, rowIndex: number, colIndex: number) => {
    const isWall = Boolean(board.walls?.[rowIndex]?.[colIndex]);
    const isGoal = board.goal?.row === rowIndex && board.goal?.column === colIndex;
    const isStart = rowIndex === 0 && colIndex === 0;
    const isFlooded = Boolean(floodedMask[rowIndex]?.[colIndex]);

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={`relative border border-gray-300 transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-bold ${
          isWall
            ? 'bg-gray-800 text-gray-200'
            : getColorClass(cellColor)
        }`}
        data-flooded={isFlooded ? 'true' : 'false'}
        style={{ width: '100%', height: '100%' }}
        title={isStart ? 'Start tile' : isGoal ? 'Goal' : undefined}
      >
        {isFlooded && !isWall ? (
          <span className="pointer-events-none absolute inset-0 border-2 border-white/90 ring-1 ring-black/20" />
        ) : null}
        {isStart ? (
          <span className="pointer-events-none absolute top-0.5 left-0.5 rounded bg-black/70 px-1 text-[9px] leading-3 text-white">
            S
          </span>
        ) : null}
        {isGoal ? 'G' : null}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="flex justify-center items-center w-full h-full min-h-0 p-2 sm:p-4">
      <div className="flex flex-col items-center gap-2">
        <div
          className="grid gap-0 bg-gray-200 rounded-lg overflow-hidden shadow-lg w-full"
          style={{
            width: `${gridSize.width}px`,
            height: `${gridSize.height}px`,
            gridTemplateColumns: `repeat(${board.columns}, 1fr)`,
            gridTemplateRows: `repeat(${board.rows}, 1fr)`,
          }}
        >
          {board.matrix.map((row, rowIndex) =>
            row.map((cellColor, colIndex) => renderCell(cellColor, rowIndex, colIndex))
          )}
        </div>
        <div className="inline-flex items-center justify-center gap-2 rounded bg-white/80 px-2 py-1 text-[10px] font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur dark:bg-gray-800/80 dark:text-gray-200 dark:ring-gray-700">
          <span>S = start</span>
          {board.goal ? <span>G = goal</span> : null}
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-[2px] border border-white/90 ring-1 ring-black/20 bg-gray-300" />
            outlined = flooded area
          </span>
        </div>
      </div>
    </div>
  );
}
