import { ChevronRight, CircleQuestionMark, Code, Moon, Sun } from "lucide-react";
import { useMemo, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import type { Difficulty } from "../types/game";
import { DIFFICULTIES } from "../utils/gameUtils";

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
            "Start from the top-left corner.",
            "Walls block flood expansion.",
            "Reach the goal tile (G) before moves run out.",
          ]
        : [
            "Start from the top-left corner.",
            "Pick a color to expand your area.",
            "Fill the whole board before moves run out.",
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
    <div className="app-screen app-screen--centered">
      <div className="panel panel--welcome">
        <h1 className="panel__title">Flood It</h1>

        <p className="panel__intro">Choose a mode, then pick difficulty.</p>

        <div className="welcome-header-actions">
          <button
            type="button"
            onClick={onOpenHelp}
            className="btn btn--subtle btn--icon"
            title="Open help and rules"
            aria-label="Open help and rules"
          >
            <CircleQuestionMark className="ui-icon" />
          </button>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="btn btn--subtle btn--icon"
            title="Toggle dark mode"
            aria-label="Toggle dark mode"
            disabled={!isMounted}
          >
            {isMounted && isDarkMode ? (
              <Sun className="ui-icon" />
            ) : (
              <Moon className="ui-icon" />
            )}
          </button>
          <a
            href="https://github.com/ekremkaraca/floodit-react"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--subtle btn--icon"
            title="View source code"
            aria-label="View source code"
          >
            <Code className="ui-icon" />
          </a>
        </div>

        <div className="welcome-tabs">
          <div className="welcome-tabs__list" role="tablist" aria-label="Game mode tabs">
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === "classic"}
              onClick={() => setActiveMode("classic")}
              className={`welcome-tabs__button ${activeMode === "classic" ? "is-active" : ""}`}
            >
              Classic
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === "maze"}
              onClick={() => setActiveMode("maze")}
              className={`welcome-tabs__button ${activeMode === "maze" ? "is-active" : ""}`}
            >
              Maze
            </button>
          </div>
          <p className="welcome-tabs__note">Classic: fill all cells. Maze: reach the goal tile.</p>
        </div>

        <div className="difficulty-list">
          {visibleDifficulties.map((difficulty) => (
            <button
              key={difficulty.name}
              type="button"
              onClick={() => startDifficulty(difficulty)}
              className="btn btn--primary btn--block difficulty-list__button"
            >
              {difficulty.name === "Custom"
                ? activeMode === "maze"
                  ? "Custom Maze"
                  : "Custom Classic"
                : difficulty.mode === "maze"
                  ? `${difficulty.name} (${difficulty.rows}x${difficulty.columns})`
                  : `${difficulty.name} (${difficulty.rows}x${difficulty.columns})`}
            </button>
          ))}
        </div>

        <div className="welcome-info-grid">
          <div className="panel__section">
            <h2 className="panel__section-title">How to Play</h2>
            <p className="welcome-mode-help">
              {activeMode === "maze" ? "Maze Mode" : "Classic Mode"}
            </p>
            <ul className="help-list">
              {howToItems.map((item) => (
                <li key={item} className="help-list__item">
                  <span className="help-list__marker">
                    <ChevronRight className="ui-icon ui-icon--sm" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="panel__section">
            <h2 className="panel__section-title">Keyboard Shortcuts</h2>
            <ul className="shortcut-list">
              <li className="shortcut-list__item">
                <span>Reset current game</span>
                <kbd className="kbd">Alt+Shift+R</kbd>
              </li>
              <li className="shortcut-list__item">
                <span>New game (current settings)</span>
                <kbd className="kbd">Alt+Shift+N</kbd>
              </li>
              <li className="shortcut-list__item">
                <span>Quit to welcome screen</span>
                <kbd className="kbd">Alt+Shift+Q</kbd>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
