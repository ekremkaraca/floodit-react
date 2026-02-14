import { Code } from "lucide-react";
import { useMemo, useState } from "react";
import { DIFFICULTIES } from "../utils/gameUtils";
import type { Difficulty } from "../types/game";

interface WelcomeProps {
  onNewGame: (difficulty: Difficulty) => void;
}

export function Welcome({ onNewGame }: WelcomeProps) {
  const [activeMode, setActiveMode] = useState<"classic" | "maze">("classic");

  const howToItems = useMemo(
    () =>
      activeMode === "maze"
        ? [
            "Start from the top-left corner",
            "Walls block flood expansion",
            "Reach the goal tile (G) before moves run out",
          ]
        : [
            "Start from the top-left corner",
            "Select colors to flood connected areas",
            "Fill the entire board with one color",
            "Complete in the minimum number of moves",
          ],
    [activeMode],
  );

  const visibleDifficulties = useMemo(
    () =>
      DIFFICULTIES.filter((difficulty) => {
        if (difficulty.name === "Custom") return true;
        return activeMode === "maze"
          ? difficulty.mode === "maze"
          : difficulty.mode !== "maze";
      }),
    [activeMode],
  );

  const startDifficulty = (difficulty: Difficulty) => {
    if (difficulty.name === "Custom") {
      onNewGame({ ...difficulty, mode: activeMode });
      return;
    }

    onNewGame(difficulty);
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-3 sm:p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full transition-colors duration-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
          Flood It
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-3 sm:mb-4">
          Choose a mode, then pick difficulty.
        </p>

        <div className="mb-4">
          <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            <button
              type="button"
              onClick={() => setActiveMode("classic")}
              className={`rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                activeMode === "classic"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Classic
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("maze")}
              className={`rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                activeMode === "maze"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Maze
            </button>
          </div>
          <p className="mt-1.5 text-center text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
            Classic: fill all cells. Maze: reach the goal tile.
          </p>
        </div>

        <div className="space-y-2.5">
          {visibleDifficulties.map((difficulty) => (
            <button
              key={difficulty.name}
              type="button"
              onClick={() => startDifficulty(difficulty)}
              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-[1.02] font-semibold text-sm sm:text-base leading-tight shadow-md"
            >
              {difficulty.name === "Custom"
                ? activeMode === "maze"
                  ? "Custom Maze (choose size and move limit)"
                  : "Custom (choose size and move limit)"
                : difficulty.mode === "maze"
                  ? `${difficulty.name} (${difficulty.rows}×${difficulty.columns}) - reach goal`
                  : `${difficulty.name} (${difficulty.rows}×${difficulty.columns})`}
            </button>
          ))}
        </div>

        <div className="mt-4 sm:mt-5 grid gap-3 sm:gap-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              How to Play
            </h2>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1.5 text-xs sm:text-sm">
              {howToItems.map((item) => (
                <li key={item} className="flex items-start leading-snug">
                  <span className="text-purple-500 dark:text-purple-400 mr-1.5">
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Keyboard Shortcuts
            </h2>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1.5 text-xs sm:text-sm">
              <li className="flex items-start justify-between gap-2">
                <span>Reset current game</span>
                <kbd className="rounded bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 font-mono text-[10px] sm:text-xs text-gray-800 dark:text-gray-200">
                  Alt+Shift+R
                </kbd>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span>New game (current settings)</span>
                <kbd className="rounded bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 font-mono text-[10px] sm:text-xs text-gray-800 dark:text-gray-200">
                  Alt+Shift+N
                </kbd>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span>Quit to welcome screen</span>
                <kbd className="rounded bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 font-mono text-[10px] sm:text-xs text-gray-800 dark:text-gray-200">
                  Alt+Shift+Q
                </kbd>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 text-center">
          <a
            href="https://github.com/ekremkaraca/floodit-react"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            <Code className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
            View Source Code
          </a>
        </div>
      </div>
    </div>
  );
}
