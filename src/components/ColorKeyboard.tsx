import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Board, GameColors } from "../types/game";

interface ColorKeyboardProps {
  colors: GameColors[];
  selectedColor: string;
  onColorSelect: (colorName: string) => void;
  disabled?: boolean;
  board?: Board;
}

export function ColorKeyboard({
  colors,
  selectedColor,
  onColorSelect,
  disabled = false,
  board,
}: ColorKeyboardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const boardSize = board ? board.rows * board.columns : 0;
  const paddingClass =
    boardSize <= 36
      ? "keyboard-wrap--large"
      : boardSize <= 100
        ? "keyboard-wrap--medium"
        : "keyboard-wrap--small";

  const layout = useMemo(() => {
    const width = containerWidth > 0 ? containerWidth : 360;
    const columns = width < 420 ? 3 : Math.min(colors.length, 6);
    const gap = boardSize > 0 && boardSize <= 100 ? 10 : 8;

    const [maxSize, minSize] =
      boardSize <= 36
        ? [88, 48]
        : boardSize <= 100
          ? [72, 42]
          : boardSize <= 196
            ? [64, 38]
            : [56, 32];

    const totalGap = gap * (columns - 1);
    const sizeFromWidth = Math.floor((Math.max(320, Math.min(width * 0.92, 540)) - totalGap) / columns);
    const size = Math.max(minSize, Math.min(maxSize, sizeFromWidth));
    const maxRowWidth = columns * size + totalGap;

    return { size, gap, maxRowWidth };
  }, [boardSize, colors.length, containerWidth]);

  return (
    <div ref={containerRef} className={`keyboard-wrap ${paddingClass}`}>
      <div className="keyboard-grid" style={{ gap: `${layout.gap}px`, maxWidth: `${layout.maxRowWidth}px` }}>
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            title={color.name}
            aria-label={`Select ${color.name} color`}
            disabled={disabled}
            className={`color-key ${selectedColor === color.name ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}`}
            style={{
              width: `${layout.size}px`,
              height: `${layout.size}px`,
              backgroundColor: color.hex || "#9ca3af",
            }}
            onClick={() => onColorSelect(color.name)}
          />
        ))}
      </div>
    </div>
  );
}
