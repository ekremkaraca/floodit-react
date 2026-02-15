import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Board } from "../types/game";
import { DEFAULT_COLORS } from "../utils/gameUtils";

interface GameBoardProps {
  board: Board;
}

const COLOR_HEX = Object.fromEntries(DEFAULT_COLORS.map((color) => [color.name, color.hex]));

export function GameBoard({ board }: GameBoardProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setWrapperSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const updateViewport = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const gridSize = useMemo(() => {
    const isDesktop = viewportSize.width >= 1024;
    const viewportWidth = viewportSize.width > 0 ? viewportSize.width * 0.9 : 900;
    const viewportHeight = viewportSize.height > 0 ? viewportSize.height * (isDesktop ? 0.65 : 0.9) : 900;

    const maxWidth = Math.min(wrapperSize.width > 0 ? wrapperSize.width : viewportWidth, viewportWidth, 900);
    const maxHeight = Math.min(wrapperSize.height > 0 ? wrapperSize.height : viewportHeight, viewportHeight, 900);

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
  }, [board.columns, board.rows, viewportSize.height, viewportSize.width, wrapperSize.height, wrapperSize.width]);

  return (
    <div ref={wrapperRef} className="board-wrap">
      <div
        className="board-grid"
        style={{
          width: `${gridSize.width}px`,
          height: `${gridSize.height}px`,
          gridTemplateColumns: `repeat(${board.columns}, 1fr)`,
          gridTemplateRows: `repeat(${board.rows}, 1fr)`,
        }}
      >
        {board.matrix.map((row, rowIndex) =>
          row.map((cellColor, colIndex) => {
            const isWall = Boolean(board.walls?.[rowIndex]?.[colIndex]);
            const isGoal = board.goal?.row === rowIndex && board.goal?.column === colIndex;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`board-cell ${isWall ? "board-cell--wall" : ""} ${isGoal ? "board-cell--goal" : ""}`}
                style={{
                  backgroundColor: isWall ? "#1f2937" : COLOR_HEX[cellColor] || "#9ca3af",
                }}
                title={isGoal ? "Goal" : undefined}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
