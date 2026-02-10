import type { GameColors, Board } from '../types/game';

interface ColorKeyboardProps {
  colors: GameColors[];
  selectedColor: string;
  onColorSelect: (colorName: string) => void;
  disabled?: boolean;
  board?: Board;
}

export function ColorKeyboard({ colors, selectedColor, onColorSelect, disabled = false, board }: ColorKeyboardProps) {
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

  // Determine button size based on board size
  const getButtonSize = (): string => {
    if (!board) return 'w-16 h-16'; // Default size
    
    const boardSize = board.rows * board.columns;
    
    if (boardSize <= 36) { // 6x6 and smaller
      return 'w-20 h-20 sm:w-24 sm:h-24';
    } else if (boardSize <= 100) { // 10x10 and smaller
      return 'w-16 h-16 sm:w-20 sm:h-20';
    } else if (boardSize <= 196) { // 14x14 and smaller
      return 'w-14 h-14 sm:w-16 sm:h-16';
    } else { // Larger boards
      return 'w-12 h-12 sm:w-14 sm:h-14';
    }
  };

  const getGapSize = (): string => {
    if (!board) return 'gap-2'; // Default gap
    
    const boardSize = board.rows * board.columns;
    
    if (boardSize <= 100) {
      return 'gap-2 sm:gap-3';
    } else {
      return 'gap-1.5 sm:gap-2';
    }
  };

  const getPadding = (): string => {
    if (!board) return 'p-4'; // Default padding
    
    const boardSize = board.rows * board.columns;
    
    if (boardSize <= 36) {
      return 'p-6 sm:p-8';
    } else if (boardSize <= 100) {
      return 'p-4 sm:p-6';
    } else {
      return 'p-3 sm:p-4';
    }
  };

  const buttonSize = getButtonSize();
  const gapSize = getGapSize();
  const padding = getPadding();

  return (
    <div className={`flex justify-center ${padding}`}>
      <div className={`flex ${gapSize} flex-wrap max-w-md sm:max-w-lg`}>
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color.name)}
            disabled={disabled}
            className={`
              ${buttonSize} rounded-lg border-4 transition-all duration-200 transform
              ${getColorClass(color.name)}
              ${selectedColor === color.name 
                ? 'border-gray-800 scale-110 shadow-lg' 
                : 'border-gray-300 hover:scale-105'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
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
