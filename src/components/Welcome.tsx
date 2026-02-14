import { Code, CircleQuestionMark, Sun, Moon } from "lucide-react";
import { useMemo, useState } from "react";
import { DIFFICULTIES } from "../utils/gameUtils";
import type { Difficulty } from "../types/game";
import { useDarkMode } from "../hooks/useDarkMode";

interface WelcomeProps {
  onNewGame: (difficulty: Difficulty) => void;
  onOpenHelp: () => void;
}

export function Welcome({ onNewGame, onOpenHelp }: WelcomeProps) {
  const [activeMode, setActiveMode] = useState<"classic" | "maze">("classic");
  const { isDarkMode, toggleDarkMode, isMounted } = useDarkMode();

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
    <div className="h-dvh overflow-hidden bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 transition-colors duration-200">
      <div className="mx-auto flex h-full w-full max-w-sm flex-col rounded-lg bg-white p-3 shadow-xl transition-colors duration-200 dark:bg-gray-800 sm:max-w-md sm:p-5">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 sm:mb-3 text-gray-800 dark:text-gray-100">
          Flood It
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-2 sm:mb-3">
          Choose a mode, then pick difficulty.
        </p>
        <div className="mb-2 flex justify-center">
          <button
            type="button"
            onClick={onOpenHelp}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:text-sm"
            title="Open help and rules"
            aria-label="Open help and rules"
          >
            <CircleQuestionMark className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="ml-2 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:text-sm"
            title="Toggle dark mode"
            aria-label="Toggle dark mode"
            disabled={!isMounted}
          >
            {isMounted && isDarkMode ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <a
            href="https://github.com/ekremkaraca/floodit-react"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:text-sm"
            title="View source code"
            aria-label="View source code"
          >
            <Code className="h-4 w-4" />
          </a>
        </div>

        <div className="mb-2">
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
          <p className="mt-1 text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Classic: fill all cells. Maze: reach the goal tile.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {visibleDifficulties.map((difficulty) => (
            <button
              key={difficulty.name}
              type="button"
              onClick={() => startDifficulty(difficulty)}
              className="w-full px-2 py-2 sm:px-3 sm:py-2.5 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-[1.02] font-semibold text-xs sm:text-sm leading-tight shadow-md text-center"
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

        <div className="mt-3 grid gap-2 sm:mt-4 sm:gap-3">
          <div className="hidden sm:block">
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

          <details className="rounded-md bg-gray-50 px-2 py-1.5 dark:bg-gray-700/40 sm:hidden">
            <summary className="cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-200">
              How to Play
            </summary>
            <ul className="mt-1.5 text-gray-600 dark:text-gray-300 space-y-1 text-[11px]">
              {howToItems.map((item) => (
                <li key={`mobile-${item}`} className="leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          </details>

          <div className="hidden sm:block">
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

          <details className="rounded-md bg-gray-50 px-2 py-1.5 dark:bg-gray-700/40 sm:hidden">
            <summary className="cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-200">
              Keyboard Shortcuts
            </summary>
            <ul className="mt-1.5 text-gray-600 dark:text-gray-300 space-y-1 text-[11px]">
              <li>Reset: Alt+Shift+R</li>
              <li>New board: Alt+Shift+N</li>
              <li>Quit: Alt+Shift+Q</li>
            </ul>
          </details>
        </div>

      </div>
    </div>
  );
}
