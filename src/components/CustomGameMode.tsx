import type { CustomGameSettings } from "../types/game";

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
    onStartCustomGame({
      gameMode,
      boardSize,
      customMoveLimit,
      moveLimit: customMoveLimit ? moveLimit : 0,
    });
  };

  return (
    <div className="app-screen app-screen--centered">
      <div className="panel panel--custom">
        <h2 className="panel__title panel__title--md">Custom Game Mode</h2>

        <div className="mode-toggle">
          <button
            type="button"
            className={`mode-toggle__button ${gameMode === "classic" ? "is-active" : ""}`}
            onClick={() => onSettingsChange({ ...settings, gameMode: "classic" })}
          >
            Classic
          </button>
          <button
            type="button"
            className={`mode-toggle__button ${gameMode === "maze" ? "is-active" : ""}`}
            onClick={() => onSettingsChange({ ...settings, gameMode: "maze" })}
          >
            Maze
          </button>
        </div>

        <div className="custom-form">
          <div>
            <label className="form-label">Board Size: {boardSize}x{boardSize}</label>
            <input
              type="range"
              min="5"
              max="25"
              value={boardSize}
              className="range-slider"
              onChange={(event) => {
                const size = Number.parseInt(event.target.value, 10);
                if (Number.isNaN(size)) return;
                onSettingsChange({ ...settings, boardSize: Math.min(25, Math.max(5, size)) });
              }}
            />
            <div className="range-labels">
              <span>5x5</span>
              <span>25x25</span>
            </div>
          </div>

          <div>
            <div className="form-row">
              <label className="form-label form-label--compact">Custom Move Limit</label>
              <button
                type="button"
                className={`switch ${customMoveLimit ? "switch--on" : ""}`}
                aria-label="Toggle custom move limit"
                aria-pressed={customMoveLimit}
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    customMoveLimit: !customMoveLimit,
                  })
                }
              >
                <span className={`switch__thumb ${customMoveLimit ? "switch__thumb--on" : ""}`} />
              </button>
            </div>

            {customMoveLimit ? (
              <div className="custom-form__nested">
                <label className="form-label">Move Limit: {moveLimit}</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={moveLimit}
                  className="range-slider"
                  onChange={(event) => {
                    const limit = Number.parseInt(event.target.value, 10);
                    if (Number.isNaN(limit)) return;
                    onSettingsChange({
                      ...settings,
                      moveLimit: Math.min(100, Math.max(5, limit)),
                    });
                  }}
                />
                <div className="range-labels">
                  <span>5</span>
                  <span>100</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="settings-card">
            <h3 className="settings-card__title">Game Settings</h3>
            <div className="settings-card__body">
              <div>Mode: {gameMode === "maze" ? "Maze" : "Classic"}</div>
              <div>
                Board: {boardSize}x{boardSize} ({boardSize * boardSize} cells)
              </div>
              <div>
                Move Limit: {customMoveLimit ? moveLimit : "Auto-calculated"}
                {!customMoveLimit ? (
                  <span className="settings-card__note">
                    (~{Math.floor((30 * boardSize) / 17)} moves)
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="action-row action-row--split">
          <button type="button" onClick={onCancel} className="btn btn--neutral btn--block">
            Cancel
          </button>
          <button type="button" onClick={handleStartGame} className="btn btn--primary btn--block">
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
