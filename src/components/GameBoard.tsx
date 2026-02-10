import type { Board } from '../types/game';

interface GameBoardProps {
  board: Board;
}

export function GameBoard({ board }: GameBoardProps) {
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

  const cellSize = Math.min(600 / Math.max(board.rows, board.columns), 40);

  return (
    <div className="flex justify-center items-center p-4">
      <div 
        className="grid gap-0 bg-gray-200 rounded-lg overflow-hidden shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${board.columns}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${board.rows}, ${cellSize}px)`,
        }}
      >
        {board.matrix.map((row, rowIndex) =>
          row.map((cellColor, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${getColorClass(cellColor)} border border-gray-300 transition-all duration-300 hover:opacity-80`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
