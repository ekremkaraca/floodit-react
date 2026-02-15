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
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

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

  useLayoutEffect(() => {
    const updateViewport = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const boardSize = board ? board.rows * board.columns : 0;
  const isMobile = viewportSize.width > 0 && viewportSize.width < 640;
  const isTinyMobile = isMobile && viewportSize.height > 0 && viewportSize.height <= 760;
  const isUltraFitDesktop = viewportSize.width >= 1024 && viewportSize.height > 0 && viewportSize.height <= 860;
  const paddingClass =
    boardSize <= 36
      ? "keyboard-wrap--large"
      : boardSize <= 100
        ? "keyboard-wrap--medium"
        : "keyboard-wrap--small";

  const layout = useMemo(() => {
    const width = containerWidth > 0 ? containerWidth : 360;
    const columns = width < 420 ? 3 : Math.min(colors.length, 6);
    const baseGap = boardSize > 0 && boardSize <= 100 ? 8 : 6;
    const gap = isUltraFitDesktop || isTinyMobile ? Math.max(3, baseGap - 3) : isMobile ? Math.max(4, baseGap - 2) : baseGap;

    const [baseMaxSize, baseMinSize] =
      boardSize <= 36
        ? [72, 40]
        : boardSize <= 100
          ? [58, 34]
          : boardSize <= 196
            ? [52, 30]
            : [46, 28];
    const sizeScale = isUltraFitDesktop ? 0.84 : isTinyMobile ? 0.74 : isMobile ? 0.82 : 1;
    const maxSize = Math.floor(baseMaxSize * sizeScale);
    const minSize = Math.floor(baseMinSize * sizeScale);

    const totalGap = gap * (columns - 1);
    const sizeFromWidth = Math.floor((Math.max(isMobile ? 260 : 320, Math.min(width * 0.92, 540)) - totalGap) / columns);
    const size = Math.max(minSize, Math.min(maxSize, sizeFromWidth));
    const maxRowWidth = columns * size + totalGap;

    return { size, gap, maxRowWidth };
  }, [boardSize, colors.length, containerWidth, isMobile, isTinyMobile, isUltraFitDesktop]);

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
