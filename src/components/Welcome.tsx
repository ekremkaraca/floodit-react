import { DIFFICULTIES } from "../utils/gameUtils";
import type { Difficulty } from "../types/game";

interface WelcomeProps {
  onNewGame: (difficulty: Difficulty) => void;
}

export function Welcome({ onNewGame }: WelcomeProps)  {
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
                {difficulty.name} ({difficulty.rows}×{difficulty.columns})
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
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.299 4.134 9.735 9.735 4.134 9.735 0 0 0-1.577-1.577 0 0 0-1.577 1.577zm-6.761 5.828c.202-3.119-.552-5.828-1.399-6.828-.748-1.376-1.932-1.539-2.629-.399-1.125-.198-1.734-.198-.504 0-.947.049-1.398.198-.398.198-.798 0-1.523.277-1.898.798-1.898 1.423 0 2.698.798 2.698 1.423 0 2.698-.798 1.423-.798zm-1.27 11.69c-2.962 0-5.47-2.069-5.47-4.977 0-2.523 2.028-4.48 4.48-4.48 1.453 0 2.923.552 3.995 1.453 1.453 0 2.923-.552 3.995-1.453 1.453 0 2.923.552 3.995 1.453 1.453 0 2.923-.552 3.995-1.453z"/>
              </svg>
              View Source Code
            </a>
          </div>
        </div>
      </div>
    );
};
