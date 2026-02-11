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

  return (
    <div ref={containerRef} className="flex justify-center items-center w-full h-full min-h-0 p-2 sm:p-4">
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
          row.map((cellColor, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${getColorClass(cellColor)} border border-gray-300 transition-all duration-300 hover:opacity-80`}
              style={{ width: '100%', height: '100%' }}
            />
          ))
        )}
      </div>
    </div>
  );
}
