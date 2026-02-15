import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { loadPersistedState, savePersistedState } from "../state/persistence";
import type { CustomGameSettings, Difficulty } from "../types/game";
import { resolveRoundStartTarget } from "../utils/gameFlow";
import type { LastGameConfig } from "../utils/gameFlow";
import { ColorKeyboard } from "./ColorKeyboard";
import { ConfirmDialog } from "./ConfirmDialog";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./GameHeader";
import { Welcome } from "./Welcome";
import { useGameLogic } from "../hooks/useGameLogic";

const CustomGameMode = lazy(() =>
  import("./CustomGameMode").then((module) => ({ default: module.CustomGameMode })),
);
const HelpRules = lazy(() =>
  import("./HelpRules").then((module) => ({ default: module.HelpRules })),
);
const GameOver = lazy(() =>
  import("./GameOver").then((module) => ({ default: module.GameOver })),
);

export function Game() {
  const [persistedState] = useState(() => loadPersistedState());
  const [showCustomMode, setShowCustomMode] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [customSettings, setCustomSettings] = useState<CustomGameSettings>(
    () =>
      persistedState?.customSettings ?? {
        gameMode: "classic",
        boardSize: 10,
        customMoveLimit: false,
        moveLimit: 20,
      },
  );
  const [confirmDialogContent, setConfirmDialogContent] = useState({
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
  });
  const [lastGameConfig, setLastGameConfig] = useState<LastGameConfig>(
    () => persistedState?.lastGameConfig ?? null,
  );

  const {
    board,
    selectedColor,
    setSelectedColor,
    startNewGame,
    startCustomGame,
    makeMove,
    resetGame,
    quitGame,
    stepsLeft,
    isGameOver,
    hasWon,
    availableColors,
  } = useGameLogic();

  const handleColorSelect = (colorName: string) => {
    if (!board || isGameOver) return;

    setSelectedColor(colorName);
    const result = makeMove(colorName);

    if (result.gameState === "won" || result.gameState === "lost") {
      setShowGameOverModal(true);
    }
  };

  const handleNewGame = (difficulty: Difficulty) => {
    if (difficulty.name === "Custom") {
      const mode = difficulty.mode;
      if (mode) {
        setCustomSettings((current) => ({ ...current, gameMode: mode }));
      }
      setShowCustomMode(true);
    } else {
      const startGame = () => {
        startNewGame(difficulty);
        setShowCustomMode(false);
        setLastGameConfig({ type: "difficulty", difficulty });
      };
      if (!board) {
        startGame();
        return;
      }
      setPendingAction(() => startGame);
      setConfirmDialogContent({
        title: "Start New Game?",
        message: "Starting a new game will end your current game. Continue?",
      });
      setShowConfirmDialog(true);
    }
  };

  const handleReset = useCallback(() => {
    if (!board) return;
    setPendingAction(() => resetGame);
    setConfirmDialogContent({
      title: "Reset Game?",
      message: "This will reset your current board and progress. Continue?",
    });
    setShowConfirmDialog(true);
  }, [board, resetGame]);

  const handleCustomGame = (settings: CustomGameSettings) => {
    setCustomSettings(settings);
    startCustomGame(settings);
    setShowCustomMode(false);
    setLastGameConfig({ type: "custom", settings });
  };

  const handleCancelCustom = () => {
    setShowCustomMode(false);
  };

  const startNewRoundWithCurrentSettings = useCallback(() => {
    const target = resolveRoundStartTarget(lastGameConfig, board);
    if (!target) return;

    if (target.type === "difficulty") {
      startNewGame(target.difficulty);
      return;
    }

    startCustomGame(target.settings);
  }, [board, lastGameConfig, startCustomGame, startNewGame]);

  const handleQuitToWelcome = useCallback(() => {
    setShowGameOverModal(false);
    setShowCustomMode(false);
    quitGame();
  }, [quitGame]);

  const closeConfirmDialog = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  }, []);

  const isTextInputTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;

    const tagName = target.tagName.toLowerCase();
    return (
      tagName === "input" ||
      tagName === "textarea" ||
      tagName === "select" ||
      target.isContentEditable
    );
  };

  useEffect(() => {
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      const isShortcutModifier = event.altKey && event.shiftKey;
      if (
        !isShortcutModifier ||
        event.ctrlKey ||
        event.metaKey ||
        isTextInputTarget(event.target)
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "r" && board && !showConfirmDialog && !showCustomMode) {
        event.preventDefault();
        handleReset();
        return;
      }

      if (key === "n" && board && !showConfirmDialog && !showCustomMode) {
        event.preventDefault();
        setPendingAction(() => startNewRoundWithCurrentSettings);
        setConfirmDialogContent({
          title: "Start New Game?",
          message: "This will start a new board with your current settings. Continue?",
        });
        setShowConfirmDialog(true);
        return;
      }

      if (key === "q" && board && !showConfirmDialog && !showCustomMode) {
        event.preventDefault();
        setPendingAction(() => handleQuitToWelcome);
        setConfirmDialogContent({
          title: "Quit Game?",
          message: "This will return to the welcome screen and end your current game. Continue?",
        });
        setShowConfirmDialog(true);
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [
    board,
    handleQuitToWelcome,
    handleReset,
    showConfirmDialog,
    showCustomMode,
    startNewRoundWithCurrentSettings,
  ]);

  useEffect(() => {
    savePersistedState({
      selectedColor,
      lastGameConfig,
      customSettings,
    });
  }, [customSettings, lastGameConfig, selectedColor]);

  const handleConfirmAction = () => {
    if (pendingAction) pendingAction();
    closeConfirmDialog();
  };

  const handleCloseGameOver = () => {
    setShowGameOverModal(false);
  };

  const handleNewGameFromGameOver = () => {
    startNewRoundWithCurrentSettings();
    setShowGameOverModal(false);
  };

  if (showHelpPage) {
    return (
      <Suspense fallback={null}>
        <HelpRules onBack={() => setShowHelpPage(false)} isInGame={Boolean(board)} />
      </Suspense>
    );
  }

  if (showCustomMode) {
    return (
      <Suspense fallback={null}>
        <CustomGameMode
          settings={customSettings}
          onSettingsChange={setCustomSettings}
          onStartCustomGame={handleCustomGame}
          onCancel={handleCancelCustom}
        />
      </Suspense>
    );
  }

  if (!board) {
    return <Welcome onNewGame={handleNewGame} onOpenHelp={() => setShowHelpPage(true)} />;
  }

  return (
    <div className="app-screen app-screen--game">
      <header className="app-header-shell">
        <div className="app-header-inner">
          <GameHeader
            boardName={board.name}
            stepsLeft={stepsLeft}
            currentStep={board.step}
            maxSteps={board.maxSteps}
            onNewGame={handleNewGame}
            onReset={handleReset}
            onHelp={() => setShowHelpPage(true)}
            controlsDisabled={false}
          />
        </div>
      </header>

      <main className="app-main">
        <div className="app-content">
          {isGameOver ? (
            <Suspense fallback={null}>
              <GameOver
                hasWon={hasWon}
                board={board}
                isOpen={showGameOverModal}
                onClose={handleCloseGameOver}
                onNewGame={handleNewGameFromGameOver}
              />
            </Suspense>
          ) : null}

          <div className="app-board-area">
            <div className="app-board-inner">
              <GameBoard board={board} />
            </div>
          </div>

          <ColorKeyboard
            colors={availableColors}
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
            disabled={isGameOver}
            board={board}
          />
        </div>
      </main>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirmAction}
        title={confirmDialogContent.title}
        message={confirmDialogContent.message}
      />
    </div>
  );
}
