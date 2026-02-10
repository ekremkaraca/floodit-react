import { useState } from 'react';
import { useGameLogic } from "../hooks/useGameLogic";
import type { Difficulty, CustomGameSettings } from "../types/game";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./GameHeader";
import { ColorKeyboard } from "./ColorKeyboard";
import { CustomGameMode } from "./CustomGameMode";
import { Welcome } from './Welcome';
import { GameOver } from './GameOver';

export function Game() {
  const [showCustomMode, setShowCustomMode] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  
  const {
    board,
    selectedColor,
    setSelectedColor,
    startNewGame,
    startCustomGame,
    makeMove,
    resetGame,
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
      // Show modal when game ends
      setShowGameOverModal(true);
      console.log(`Game ${result.gameState}!`);
    }
  };

  const handleNewGame = (difficulty: Difficulty) => {
    if (difficulty.name === 'Custom') {
      setShowCustomMode(true);
    } else {
      startNewGame(difficulty);
    }
  };

  const handleCustomGame = (settings: CustomGameSettings) => {
    startCustomGame(settings);
    setShowCustomMode(false);
  };

  const handleCancelCustom = () => {
    setShowCustomMode(false);
  };

  const handleCloseGameOver = () => {
    setShowGameOverModal(false);
  };

  if (showCustomMode) {
    return (
      <CustomGameMode
        onStartCustomGame={handleCustomGame}
        onCancel={handleCancelCustom}
      />
    );
  }

  if (!board) {
    return (
      <Welcome onNewGame={handleNewGame} />
    );
  }

  return (
    <div className="min-h-dvh bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-200">
      <header className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-gray-800/95 border-b border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur transition-colors duration-200">
        <div className="max-w-full mx-auto px-2 py-0">
          <GameHeader
            boardName={board.name}
            stepsLeft={stepsLeft}
            currentStep={board.step}
            maxSteps={board.maxSteps}
            onNewGame={handleNewGame}
            onReset={resetGame}
            controlsDisabled={false}
          />
        </div>
      </header>

      <div className="flex-1 min-h-0 p-2 sm:p-4 overflow-auto">
        <div className="max-w-4xl mx-auto min-h-0 h-full flex flex-col">
          {isGameOver && (
            <GameOver 
                hasWon={hasWon} 
                board={board} 
                isOpen={showGameOverModal}
                onClose={handleCloseGameOver}
            />
          )}

          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="w-full">
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
      </div>
    </div>
  );
}
