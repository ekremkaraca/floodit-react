import { Code } from "lucide-react";
import { DIFFICULTIES } from "../utils/gameUtils";
import type { Difficulty } from "../types/game";

interface WelcomeProps {
  onNewGame: (difficulty: Difficulty) => void;
}

export function Welcome({ onNewGame }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full transition-colors duration-200">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Flood It
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            How to Play
          </h2>
          <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-purple-500 dark:text-purple-400 mr-2">
                ▸
              </span>
              Start from the top-left corner
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 dark:text-purple-400 mr-2">
                ▸
              </span>
              Select colors to flood connected areas
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 dark:text-purple-400 mr-2">
                ▸
              </span>
              Fill the entire board with one color
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 dark:text-purple-400 mr-2">
                ▸
              </span>
              Complete in the minimum number of moves
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Keyboard Shortcuts
          </h2>
          <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm">
            <li className="flex items-start justify-between gap-3">
              <span>Reset current game</span>
              <kbd className="rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5 font-mono text-xs text-gray-800 dark:text-gray-200">
                Alt+Shift+R
              </kbd>
            </li>
            <li className="flex items-start justify-between gap-3">
              <span>New game (current settings)</span>
              <kbd className="rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5 font-mono text-xs text-gray-800 dark:text-gray-200">
                Alt+Shift+N
              </kbd>
            </li>
            <li className="flex items-start justify-between gap-3">
              <span>Quit to welcome screen</span>
              <kbd className="rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5 font-mono text-xs text-gray-800 dark:text-gray-200">
                Alt+Shift+Q
              </kbd>
            </li>
          </ul>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Choose your difficulty level to begin!
        </p>

        <div className="space-y-3">
          {DIFFICULTIES.map((difficulty) => (
            <button
              key={difficulty.name}
              type="button"
              onClick={() => onNewGame(difficulty)}
              className="w-full px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 font-semibold shadow-md"
            >
              {difficulty.name === "Custom"
                ? "Custom (choose size and move limit)"
                : `${difficulty.name} (${difficulty.rows}×${difficulty.columns})`}
            </button>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a
            href="https://github.com/ekremkaraca/floodit-react"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            <Code className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
            View Source Code
          </a>
        </div>
      </div>
    </div>
  );
}
