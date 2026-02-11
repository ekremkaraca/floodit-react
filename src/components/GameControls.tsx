import { ChevronDown, Moon, Sun } from "lucide-react";
import type { Difficulty } from "../types/game";
import { DIFFICULTIES } from "../utils/gameUtils";
import { useDarkMode } from "../hooks/useDarkMode";

interface GameControlsProps {
  onNewGame: (difficulty: Difficulty) => void;
  onReset: () => void;
  disabled?: boolean;
}

export function GameControls({
  onNewGame,
  onReset,
  disabled = false,
}: GameControlsProps) {
  const { isDarkMode, toggleDarkMode, isMounted } = useDarkMode();

  return (
    <div className="flex items-center gap-2 px-1 py-0">
      {/* Mobile-First New Game Button */}
      <details className="relative sm:relative">
        <summary
          className={`list-none px-3 py-2 sm:px-4 sm:py-2.5 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-lg transition-all duration-200 font-semibold shadow-md text-sm sm:text-base ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:from-green-600 hover:to-emerald-600 cursor-pointer active:scale-95"
              }`}
          aria-label="Start new game"
          aria-disabled={disabled}
          onClick={(event) => {
            if (disabled) event.preventDefault();
          }}
        >
          <span className="inline-flex items-center gap-1 sm:gap-2">
            <span className="hidden xs:inline">New</span>
            <span className="xs:hidden">+</span>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
          </span>
        </summary>

        <div className="absolute top-full left-0 mt-1 sm:mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10 min-w-full sm:min-w-[200px]">
          <div className="py-1 sm:py-2">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty.name}
                type="button"
                onClick={() => {
                  onNewGame(difficulty);
                }}
                disabled={disabled}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                aria-label={`Start new ${difficulty.name.toLowerCase()} game (${difficulty.rows}×${difficulty.columns})`}
              >
                <div className="font-medium">{difficulty.name}</div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {difficulty.rows}×{difficulty.columns}
                </div>
              </button>
            ))}
          </div>
        </div>
      </details>

      {/* Mobile-First Reset Button */}
      <button
        type="button"
        onClick={onReset}
        disabled={disabled}
        className="px-3 py-2 sm:px-4 sm:py-2.5 bg-linear-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base active:scale-95"
        aria-label="Reset current game"
        aria-disabled={disabled}
      >
        <span className="hidden xs:inline">Reset</span>
        <span className="xs:hidden">↻</span>
      </button>

      {/* Mobile-First Dark Mode Toggle */}
      <button
        type="button"
        onClick={toggleDarkMode}
        className="px-2 py-2 sm:px-4 sm:py-2.5 bg-linear-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        title="Toggle dark mode"
        aria-label="Toggle dark mode"
        disabled={!isMounted}
      >
        {isMounted && isDarkMode ? (
          <Sun className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
        ) : (
          <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
        )}
      </button>
    </div>
  );
}
