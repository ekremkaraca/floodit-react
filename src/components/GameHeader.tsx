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
  const safeMaxSteps = Math.max(1, maxSteps);
  const percentageRemaining = (stepsLeft / safeMaxSteps) * 100;
  const stepsColorClass =
    percentageRemaining > 50
      ? "steps-tone--good"
      : percentageRemaining > 25
        ? "steps-tone--warn"
        : "steps-tone--danger";

  const progressPercentage = (currentStep / safeMaxSteps) * 100;

  return (
    <nav className="game-header">
      <div className="game-header__inner">
        <div className="game-header__row">
          <div className="game-header__main">
            <div>
              <h1 className="game-header__title">{boardName}</h1>
            </div>

            <div className="game-header__steps-mobile">
              <div className={`steps-count ${stepsColorClass}`}>{stepsLeft}</div>
              <div className="steps-label">left</div>
            </div>

            <div className="game-header__progress-wrap">
              <div className="progress">
                <div className="progress__meta">
                  <span className={stepsColorClass}>
                    {currentStep} / {maxSteps} ({stepsLeft} steps left)
                  </span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="progress__track">
                  <div
                    className="progress__fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="game-header__actions">
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
