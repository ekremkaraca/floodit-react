import { X } from "lucide-react";
import type { Board } from "../types/game";

interface GameOverProps {
  hasWon: boolean;
  board: Board;
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
}

export function GameOver({ hasWon, board, isOpen, onClose, onNewGame }: GameOverProps) {
  const isMaze = board.mode === "maze";
  const stateClass = isOpen ? "is-open" : "is-closed";

  return (
    <div className={`modal modal--gameover ${stateClass}`}>
      <div className={`modal__backdrop ${stateClass}`} onClick={onClose} aria-hidden="true" />

      <div className={`modal__panel modal__panel--gameover ${stateClass}`} role="dialog" aria-modal="true">
        <button
          type="button"
          onClick={onClose}
          className="modal__close"
          aria-label="Close game over dialog"
        >
          <X className="ui-icon modal__close-icon" />
        </button>

        <div className="modal__content">
          <div className={`modal__status ${hasWon ? "modal__status--success" : "modal__status--danger"}`}>
            {hasWon ? "You Won!" : "Game Over"}
          </div>

          <p className="modal__lead">
            {hasWon
              ? isMaze
                ? `Great run! You reached the maze goal in ${board.step} moves.`
                : `Congratulations! You completed the board in ${board.step} moves!`
              : isMaze
                ? "You ran out of moves before reaching the maze goal."
                : "You ran out of moves. The board was not completely flooded."}
          </p>

          {hasWon ? (
            <div className="modal__score">
              <div className="modal__score-label">Efficiency Score</div>
              <div className="modal__score-value">
                {board.step > 0 ? Math.round((board.maxSteps / board.step) * 100) : 100}%
              </div>
              <div className="modal__score-meta">
                {board.step > 0
                  ? `${board.step} moves used out of ${board.maxSteps}`
                  : "Perfect game!"}
              </div>
            </div>
          ) : null}

          <div className="modal__actions modal__actions--center">
            <button type="button" onClick={onClose} className="btn btn--neutral">
              Close
            </button>
            <button type="button" onClick={onNewGame} className="btn btn--primary">
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
