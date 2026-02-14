interface HelpRulesProps {
  onBack: () => void;
  isInGame: boolean;
}

export function HelpRules({ onBack, isInGame }: HelpRulesProps) {
  return (
    <div className="min-h-dvh bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 transition-colors duration-200">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-5 shadow-xl dark:bg-gray-800 sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
            Help & Rules
          </h1>
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            {isInGame ? "Back to Game" : "Back"}
          </button>
        </div>

        <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Objective
            </h2>
            <ul className="space-y-1.5">
              <li>Classic: flood the entire board into one color.</li>
              <li>Maze: reach the goal tile before moves run out.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              How to Play
            </h2>
            <ul className="space-y-1.5">
              <li>The flooded area always starts from the top-left tile (S).</li>
              <li>Pick a color from the bottom palette each move.</li>
              <li>Tiles outlined in white show your current flooded area.</li>
              <li>In maze mode, walls block flood expansion and G marks the goal.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Controls
            </h2>
            <ul className="space-y-1.5">
              <li>Alt+Shift+R: reset current game</li>
              <li>Alt+Shift+N: start new board with current settings</li>
              <li>Alt+Shift+Q: quit to welcome screen</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
