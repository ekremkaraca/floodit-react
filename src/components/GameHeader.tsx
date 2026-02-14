import type { Difficulty } from "../types/game";
import { GameControls } from "./GameControls";

interface GameHeaderProps {
  boardName: string;
  stepsLeft: number;
  currentStep: number;
  maxSteps: number;
  onNewGame?: (difficulty: Difficulty) => void;
  onReset?: () => void;
  onHelp?: () => void;
  controlsDisabled?: boolean;
}

export function GameHeader({
  boardName,
  stepsLeft,
  currentStep,
  maxSteps,
  onNewGame,
  onReset,
  onHelp,
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
                  <span
                    className={`${getStepsColorClass()
                      .replace(
                        "text-green-600",
                        "text-green-600 dark:text-green-400",
                      )
                      .replace(
                        "text-yellow-600",
                        "text-yellow-600 dark:text-yellow-400",
                      )
                      .replace(
                        "text-red-600",
                        "text-red-600 dark:text-red-400",
                      )}`}
                  >
                    {currentStep} / {maxSteps} ({stepsLeft} steps left)
                  </span>
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
              onHelp={onHelp}
              disabled={controlsDisabled}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
