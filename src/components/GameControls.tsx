import { ChevronDown, CircleHelp, Code, Moon, RotateCcw, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import type { Difficulty } from "../types/game";
import { DIFFICULTIES } from "../utils/gameUtils";

interface GameControlsProps {
  onNewGame: (difficulty: Difficulty) => void;
  onReset: () => void;
  onHelp?: () => void;
  disabled?: boolean;
}

export function GameControls({
  onNewGame,
  onReset,
  onHelp,
  disabled = false,
}: GameControlsProps) {
  const { isDarkMode, toggleDarkMode, isMounted } = useDarkMode();
  const [isNewGameMenuOpen, setIsNewGameMenuOpen] = useState(false);
  const newGameMenuRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    if (!isNewGameMenuOpen) return;

    const closeOnOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || !newGameMenuRef.current?.contains(target)) {
        setIsNewGameMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
    };
  }, [isNewGameMenuOpen]);

  return (
    <>
      <details ref={newGameMenuRef} open={isNewGameMenuOpen} className="menu menu--newgame">
        <summary
          className="btn btn--new menu__trigger"
          aria-label="Start new game"
          aria-disabled={disabled}
          onClick={(event) => {
            event.preventDefault();
            if (disabled) return;
            setIsNewGameMenuOpen((open) => !open);
          }}
        >
          <span>New</span>
          <ChevronDown className="ui-icon menu__trigger-icon" aria-hidden="true" />
        </summary>

        <div className="menu__panel">
          <div className="menu__list">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty.name}
                type="button"
                onClick={() => {
                  onNewGame(difficulty);
                  setIsNewGameMenuOpen(false);
                }}
                disabled={disabled}
                className="menu-item"
                aria-label={
                  difficulty.name === "Custom"
                    ? "Open custom game settings"
                    : `Start new ${difficulty.name.toLowerCase()} game (${difficulty.rows}x${difficulty.columns})`
                }
              >
                <div className="menu-item__title">{difficulty.name}</div>
                <div className="menu-item__meta">
                  {difficulty.name === "Custom"
                    ? "Configure mode, board size and move limit"
                    : difficulty.mode === "maze"
                      ? `${difficulty.rows}x${difficulty.columns} - reach goal`
                      : `${difficulty.rows}x${difficulty.columns}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      </details>

      <button
        type="button"
        onClick={onReset}
        disabled={disabled}
        className="btn btn--neutral btn--icon"
        title="Reset game"
        aria-label="Reset game"
      >
        <RotateCcw className="ui-icon" />
      </button>

      <button
        type="button"
        onClick={toggleDarkMode}
        className="btn btn--neutral btn--icon"
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

      <button
        type="button"
        onClick={() => onHelp?.()}
        className="btn btn--neutral btn--icon"
        title="Open help and rules"
        aria-label="Open help and rules"
        disabled={!onHelp}
      >
        <CircleHelp className="ui-icon" />
      </button>

      <button
        type="button"
        onClick={() => window.open("https://github.com/ekremkaraca/floodit-react", "_blank")}
        className="btn btn--neutral btn--icon"
        title="View source code on GitHub"
        aria-label="View source code on GitHub"
      >
        <Code className="ui-icon" />
      </button>
    </>
  );
}
