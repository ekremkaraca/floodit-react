interface GameOverProps {
    hasWon: boolean;
    board: any;
    isOpen: boolean;
    onClose: () => void;
}

export function GameOver({ hasWon, board, isOpen, onClose }: GameOverProps) {
    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div 
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full transition-all duration-300 transform ${
                    isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    aria-label="Close game over dialog"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Game Over Content */}
                <div className="text-center">
                    <div
                        className={`text-3xl font-bold mb-4 ${
                            hasWon
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                        }`}
                    >
                        {hasWon ? "🎉 You Won!" : "😔 Game Over"}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                        {hasWon
                            ? `Congratulations! You completed the board in ${board.step} moves!`
                            : "You ran out of moves. The board was not completely flooded."}
                    </p>
                    
                    {hasWon && (
                        <div className="mb-6">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Efficiency Score
                            </div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {board.step > 0
                                    ? Math.round((board.maxSteps / board.step) * 100)
                                    : 100}
                                %
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {board.step > 0
                                    ? `${board.step} moves used out of ${board.maxSteps}`
                                    : 'Perfect game!'
                                }
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold shadow-md"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                // Trigger new game - this would need to be passed as a prop
                                window.location.reload();
                            }}
                            className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold shadow-md"
                        >
                            New Game
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}