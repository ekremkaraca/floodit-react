import type { Difficulty } from "../types/game";
import { GameControls } from "./GameControls";

interface GameHeaderProps {
  boardName: string;
  stepsLeft: number;
  currentStep: number;
  maxSteps: number;
  onNewGame?: (difficulty: Difficulty) => void;
  onReset?: () => void;
  controlsDisabled?: boolean;
}

export function GameHeader({
  boardName,
  stepsLeft,
  currentStep,
  maxSteps,
  onNewGame,
  onReset,
  controlsDisabled = false,
}: GameHeaderProps) {
  const getStepsColorClass = (): string => {
    const safeMaxSteps = Math.max(1, maxSteps);
    const percentageRemaining = (stepsLeft / safeMaxSteps) * 100;
    if (percentageRemaining > 50) return "text-green-600";
    if (percentageRemaining > 25) return "text-yellow-600";
    return "text-red-600";
  };

  const progressPercentage = (currentStep / Math.max(1, maxSteps)) * 100;

  return (
    <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-md px-2 sm:px-3 py-1.5 sm:py-2 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Section: Game Info */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
                {boardName}
              </h1>
            </div>

            {/* Mobile Steps Counter */}
            <div className="flex items-center gap-1 sm:hidden">
              <div
                className={`text-sm font-bold ${getStepsColorClass()
                  .replace(
                    "text-green-600",
                    "text-green-600 dark:text-green-400",
                  )
                  .replace(
                    "text-yellow-600",
                    "text-yellow-600 dark:text-yellow-400",
                  )
                  .replace("text-red-600", "text-red-600 dark:text-red-400")}`}
              >
                {stepsLeft}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                left
              </div>
            </div>

            {/* Desktop Progress Bar */}
            <div className="hidden sm:flex flex-1 max-w-xs items-center">
              <div className="w-full">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1 px-2">
                  <span className={`${getStepsColorClass()
                    .replace(
                      "text-green-600",
                      "text-green-600 dark:text-green-400",
                    )
                    .replace(
                      "text-yellow-600",
                      "text-yellow-600 dark:text-yellow-400",
                    )
                    .replace("text-red-600", "text-red-600 dark:text-red-400")}`}>{currentStep} / {maxSteps} ({stepsLeft} steps left)</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <GameControls
              onNewGame={onNewGame || (() => {})}
              onReset={onReset || (() => {})}
              disabled={controlsDisabled}
            />
            
            {/* Source Code Button */}
            <a
              href="https://github.com/ekremkaraca/floodit-react"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="View source code"
              aria-label="View source code on GitHub"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 5.299 4.134 9.735 9.735 4.134 9.735 0 0-1.577 1.577 0 0 0-1.577 1.577zm-6.761 5.828c.202-3.119-.552-5.828-1.399-6.828-.748-1.376-1.932-1.539-2.629-.399-1.125-.198-1.734-.198-.504 0-.947.049-1.398.198-.398.198-.798 0-1.523.277-1.898.798-1.898 1.423 0 2.698.798 2.698 1.423 0 2.698-.798 1.423-.798zm-1.27 11.69c-2.962 0-5.47-2.069-5.47-4.977 0-2.523 2.028-4.48 4.48-4.48 1.453 0 2.923.552 3.995 1.453 1.453 0 2.923-.552 3.995-1.453 1.453 0 2.923-.552 3.995-1.453z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
