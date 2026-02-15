interface HelpRulesProps {
  onBack: () => void;
  isInGame: boolean;
}

export function HelpRules({ onBack, isInGame }: HelpRulesProps) {
  return (
    <div className="app-screen app-screen--centered">
      <div className="panel panel--help">
        <div className="help-header-row">
          <h1 className="panel__title panel__title--md">Help & Rules</h1>
          <button type="button" onClick={onBack} className="btn btn--neutral">
            {isInGame ? "Back to Game" : "Back"}
          </button>
        </div>

        <div className="help-sections">
          <section className="panel__section">
            <h2 className="panel__section-title">Objective</h2>
            <ul className="help-list">
              <li>Classic: flood the entire board into one color.</li>
              <li>Maze: reach the goal tile before moves run out.</li>
            </ul>
          </section>

          <section className="panel__section">
            <h2 className="panel__section-title">How to Play</h2>
            <ul className="help-list">
              <li>The flooded area always starts from the top-left tile.</li>
              <li>Pick a color from the bottom palette each move.</li>
              <li>In maze mode, walls block flood expansion and G marks the goal.</li>
            </ul>
          </section>

          <section className="panel__section">
            <h2 className="panel__section-title">Controls</h2>
            <ul className="shortcut-list">
              <li className="shortcut-list__item"><span>Reset current game</span><kbd className="kbd">Alt+Shift+R</kbd></li>
              <li className="shortcut-list__item"><span>New board with current settings</span><kbd className="kbd">Alt+Shift+N</kbd></li>
              <li className="shortcut-list__item"><span>Quit to welcome screen</span><kbd className="kbd">Alt+Shift+Q</kbd></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
