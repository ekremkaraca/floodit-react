import type { CustomGameSettings } from '../types/game';

interface CustomGameModeProps {
  settings: CustomGameSettings;
  onSettingsChange: (settings: CustomGameSettings) => void;
  onStartCustomGame: (settings: CustomGameSettings) => void;
  onCancel: () => void;
}

export function CustomGameMode({
  settings,
  onSettingsChange,
  onStartCustomGame,
  onCancel,
}: CustomGameModeProps) {
  const { gameMode, boardSize, customMoveLimit, moveLimit } = settings;
  const handleStartGame = () => {
    const nextSettings: CustomGameSettings = {
      gameMode,
      boardSize,
      customMoveLimit,
      moveLimit: customMoveLimit ? moveLimit : 0,
    };
    onStartCustomGame(nextSettings);
  };

  const handleBoardSizeChange = (value: string) => {
    const size = parseInt(value);
    if (!isNaN(size) && size >= 5 && size <= 25) {
      onSettingsChange({
        ...settings,
        boardSize: size,
      });
    }
  };

  const handleMoveLimitChange = (value: string) => {
    const limit = parseInt(value);
    if (!isNaN(limit) && limit >= 5 && limit <= 100) {
      onSettingsChange({
        ...settings,
        moveLimit: limit,
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full transition-colors duration-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Custom Game Mode
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSettingsChange({ ...settings, gameMode: 'classic' })}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  gameMode === 'classic'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                Classic
              </button>
              <button
                type="button"
                onClick={() => onSettingsChange({ ...settings, gameMode: 'maze' })}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  gameMode === 'maze'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                Maze
              </button>
            </div>
          </div>

          {/* Board Size Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Board Size: {boardSize}×{boardSize}
            </label>
            <input
              type="range"
              min="5"
              max="25"
              value={boardSize}
              onChange={(e) => handleBoardSizeChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>5×5</span>
              <span>25×25</span>
            </div>
          </div>

          {/* Custom Move Limit Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Move Limit
              </label>
              <button
                type="button"
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    customMoveLimit: !customMoveLimit,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  customMoveLimit ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    customMoveLimit ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {customMoveLimit && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Move Limit: {moveLimit}
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={moveLimit}
                  onChange={(e) => handleMoveLimitChange(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>5</span>
                  <span>100</span>
                </div>
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Game Settings
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div>Mode: {gameMode === 'maze' ? 'Maze' : 'Classic'}</div>
              <div>Board: {boardSize}×{boardSize} ({boardSize * boardSize} cells)</div>
              <div>
                Move Limit: {customMoveLimit ? moveLimit : 'Auto-calculated'}
                {!customMoveLimit && (
                  <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                    (≈{Math.floor(30 * (boardSize * 6) / (17 * 6))} moves)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold shadow-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartGame}
            className="flex-1 px-4 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold shadow-md"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
