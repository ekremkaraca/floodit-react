import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { GameColors, Board } from '../types/game';

interface ColorKeyboardProps {
  colors: GameColors[];
  selectedColor: string;
  onColorSelect: (colorName: string) => void;
  disabled?: boolean;
  board?: Board;
}

export function ColorKeyboard({ colors, selectedColor, onColorSelect, disabled = false, board }: ColorKeyboardProps) {
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

  const getColorClass = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-game-blue hover:bg-blue-600',
      'green': 'bg-game-green hover:bg-green-600',
      'yellow': 'bg-game-yellow hover:bg-yellow-500',
      'orange': 'bg-game-orange hover:bg-orange-600',
      'red': 'bg-game-red hover:bg-red-600',
      'purple': 'bg-game-purple hover:bg-purple-600',
    };
    return colorMap[colorName] || 'bg-gray-400 hover:bg-gray-500';
  };

  const getGapSize = (): number => {
    if (!board) return 8;

    const boardSize = board.rows * board.columns;

    if (boardSize <= 100) return 10;
    return 8;
  };

  const getPadding = (): string => {
    if (!board) return 'p-4';

    const boardSize = board.rows * board.columns;

    if (boardSize <= 36) return 'p-6 sm:p-8';
    if (boardSize <= 100) return 'p-4 sm:p-6';
    return 'p-3 sm:p-4';
  };

  const layout = useMemo(() => {
    const width = containerWidth > 0 ? containerWidth : 360;
    const columns = width < 420 ? 3 : Math.min(colors.length, 6);
    const gap = getGapSize();

    let maxSize = 64;
    let minSize = 36;

    if (board) {
      const boardSize = board.rows * board.columns;
      if (boardSize <= 36) {
        maxSize = 88;
        minSize = 48;
      } else if (boardSize <= 100) {
        maxSize = 72;
        minSize = 42;
      } else if (boardSize <= 196) {
        maxSize = 64;
        minSize = 38;
      } else {
        maxSize = 56;
        minSize = 32;
      }
    }

    const totalGap = gap * (columns - 1);
    const sizeFromWidth = Math.floor((width - totalGap) / columns);
    const size = Math.max(minSize, Math.min(maxSize, sizeFromWidth));
    const maxRowWidth = columns * size + totalGap;

    return { size, gap, maxRowWidth };
  }, [board, colors.length, containerWidth]);

  const padding = getPadding();

  return (
    <div ref={containerRef} className={`flex justify-center ${padding}`}>
      <div
        className="flex flex-wrap"
        style={{ gap: `${layout.gap}px`, maxWidth: `${layout.maxRowWidth}px` }}
      >
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color.name)}
            disabled={disabled}
            className={`
              rounded-lg border-4 transition-all duration-200 transform
              ${getColorClass(color.name)}
              ${selectedColor === color.name 
                ? 'border-gray-800 scale-110 shadow-lg' 
                : 'border-gray-300 hover:scale-105'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ width: `${layout.size}px`, height: `${layout.size}px` }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          >
            <span className="sr-only">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
