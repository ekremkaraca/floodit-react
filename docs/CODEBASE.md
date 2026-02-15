# FloodIt React Codebase Guide

This document explains how the project is organized, how game state flows through the app, and where to make common changes safely.

## High-Level Architecture

The app uses React component state with a mostly unidirectional flow:

1. User interacts with UI in `src/components/*`.
2. `Game.tsx` handles screen-level intent (new game, reset, confirm, custom mode, shortcuts).
3. `useGameLogic` (`src/hooks/useGameLogic.ts`) computes board/game transitions using pure utilities in `src/utils/gameUtils.ts` and `src/utils/gameFlow.ts`.
4. React rerenders components from updated state.
5. Persisted lightweight UI/config state is loaded/saved via `src/state/persistence.ts`.

Core gameplay now supports two modes:

- `classic`: win by making all cells the same color.
- `maze`: walls block flood expansion; win by reaching the goal tile at bottom-right.

## Entry Points

- `index.html`: bootstraps dark mode preference early via an inline script in `<head>`.
- `src/main.tsx`: mounts `<App />` in `StrictMode`.
- `src/App.tsx`: renders the root game component.
- `src/components/Game.tsx`: application orchestrator for view switching and global flows.

## Tooling Commands

- `bun run dev`: runs Bun HTML dev server + Tailwind CSS watch compiler in parallel
- `bun run build`: compiles Tailwind CSS then builds production bundle into `dist/`
- `bun run preview`: serves built output from `dist/index.html` on preview port
- `bun run typecheck`: runs TypeScript project build-mode checks

## Core Modules

- `src/utils/gameUtils.ts`
  - Pure game engine helpers and constants.
  - Owns:
    - palette (`DEFAULT_COLORS`)
    - presets (`DIFFICULTIES`) including classic and maze levels
    - board initialization (`initializeBoard`, `initializeMazeBoard`, `initializeCustomBoard`)
    - flood algorithm (`flood`) with maze wall blocking
    - move helpers (`calculateMaxSteps`, `getStepsLeft`)
    - win checks (`isAllFilled`, `isGoalReached`, `isBoardWon`)

- `src/hooks/useGameLogic.ts`
  - Encapsulates board lifecycle and move processing for UI.
  - Exposes:
    - `startNewGame`
    - `startCustomGame`
    - `makeMove`
    - `resetGame`
    - `quitGame`
    - computed status: `stepsLeft`, `isGameOver`, `hasWon`
  - Mode-aware behavior:
    - difficulty/custom start routes to classic or maze initialization
    - reset preserves current board mode and regenerates a fresh board

- `src/utils/gameFlow.ts`
  - Pure orchestration helpers used by hooks/components.
  - `resolveMove(board, color)`:
    - validates move eligibility
    - applies flood
    - resolves `playing`/`won`/`lost` outcome via unified win logic
  - `resolveRoundStartTarget(lastGameConfig, board)`:
    - resolves “new round with current settings”
    - preserves mode information when falling back from active board

- `src/components/Game.tsx`
  - Application orchestrator for screen transitions and global flows.
  - Coordinates app-level UI state not owned by `useGameLogic`:
    - `showCustomMode`
    - `showGameOverModal`
    - confirm dialog lifecycle (`showConfirmDialog`, `pendingAction`, `confirmDialogContent`)
    - `lastGameConfig` for "new round with current settings"
    - mode-aware custom setup defaults (`customSettings`)
  - Registers global keyboard shortcuts.
  - Loads persisted `customSettings` and `lastGameConfig` on mount, then persists selected lightweight state.

- `src/state/persistence.ts`
  - Versioned localStorage load/save + sanitization for non-board state.
  - Persists:
    - `selectedColor`
    - `lastGameConfig`
    - `customSettings`
  - Sanitizes:
    - `customSettings.gameMode` (`classic`/`maze`)
    - board-size and move-limit bounds
    - last-game difficulty/custom structures (including difficulty `mode`)
    - selected color validity against palette
  - Invalid or malformed snapshots fall back safely to defaults/null.

- `src/components/*`
  - Presentation and local interaction layers:
  - `Welcome.tsx`: difficulty list (classic + maze + custom)
  - `CustomGameMode.tsx`: mode toggle + board-size/move-limit controls
  - `GameHeader.tsx`: progress + controls container
  - `GameControls.tsx`: new/reset/theme/source actions
  - `GameBoard.tsx`: responsive grid rendering, including walls and `G` goal marker
  - `ColorKeyboard.tsx`: color selection panel
  - `ConfirmDialog.tsx`: shared confirm dialog
  - `GameOver.tsx`: mode-aware win/lose messaging

- `src/hooks/useDarkMode.ts` + inline script in `index.html`
  - Dark mode preference and DOM class management.
  - Early script prevents flash of incorrect theme before React hydration.

## Domain Model

Key types are in `src/types/game.ts`.

- `Board`
  - shared fields: `name`, `seed`, `rows`, `columns`, `step`, `maxSteps`, `matrix`
  - mode field: `mode` (`classic` | `maze`)
  - maze-only optional fields:
    - `walls: boolean[][]`
    - `goal: { row, column }`
- `Difficulty`
  - includes dimensions, move limit, and optional mode
- `CustomGameSettings`
  - `gameMode`, `boardSize`, `customMoveLimit`, `moveLimit`

## State Shape

Managed in `src/components/Game.tsx`:

- `showCustomMode`
- `showGameOverModal`
- `showConfirmDialog`
- `pendingAction`
- `confirmDialogContent`
- `lastGameConfig`
- `customSettings` (`gameMode`, `boardSize`, `customMoveLimit`, `moveLimit`)

Managed in `src/hooks/useGameLogic.ts`:

- `board`
- `selectedColor`
- derived status: `stepsLeft`, `isGameOver`, `hasWon`

Persisted via `src/state/persistence.ts`:

- `selectedColor`
- `lastGameConfig`
- `customSettings`

## Game Lifecycle

### Start Flow

1. Difficulty/custom selected from welcome or header menu.
2. `startNewGame` or `startCustomGame` initializes a board:
   - classic mode -> `initializeBoard`
   - maze mode -> `initializeMazeBoard`
3. Transient UI state is reset (selection, modals as needed).
4. Gameplay screen renders with current board.

### Move Flow

1. Player chooses a color in `ColorKeyboard`.
2. `makeMove(color)` delegates to `resolveMove`.
3. `resolveMove` validates state, applies `flood`, and evaluates win/loss.
4. Hook updates board and returns progression state:
   - `playing`
   - `won`
   - `lost`
5. `Game.tsx` opens game-over modal on win/loss.

### Win Conditions

- Classic boards: `isAllFilled(board)`
- Maze boards: `isGoalReached(board)` using flooded connectivity while respecting walls
- Unified check used by gameplay: `isBoardWon(board)`

### Confirmed Actions

Reset/new/quit use a shared confirm dialog:

1. Set `pendingAction` and dialog content.
2. Open confirm dialog.
3. On confirm: execute `pendingAction`, then close dialog through one centralized close path.
4. On cancel: close dialog and clear `pendingAction`.

### Persistence Lifecycle

1. On `Game` mount, `loadPersistedState()` initializes:
   - `customSettings`
   - `lastGameConfig`
2. During runtime, `Game` saves on selected state changes via `savePersistedState()`:
   - `selectedColor`
   - `customSettings`
   - `lastGameConfig`
3. Persisted payload is versioned (`STORAGE_VERSION`) and sanitized on read.
4. If version/schema is invalid, load returns `null` and the app uses defaults.

## Keyboard Shortcuts

Defined in `src/components/Game.tsx` (gameplay only):

- `Alt+Shift+R`: reset current game (with confirmation)
- `Alt+Shift+N`: start new round with current settings (with confirmation)
- `Alt+Shift+Q`: quit to welcome screen (with confirmation)

Ignored when:

- focus is in an input/textarea/select/contentEditable
- no active board
- confirm dialog is open
- custom mode screen is open
- Ctrl/Meta is pressed

## Testing

Bun-native tests live under `tests/` and cover:

- `tests/utils/gameUtils.test.ts`
  - classic + maze engine behavior
  - deterministic initialization and flood/win logic
- `tests/utils/gameFlow.test.ts`
  - move-result resolution and round-start target fallback behavior
- `tests/state/persistence.test.ts`
  - save/load behavior and sanitization

Test runner: `bun test` (via `bun run test`).

## Styling

- Main styling lives in `src/index.css` and is adapted from upstream `floodit-js`.
- The app uses semantic component class names (for example `panel`, `game-header`, `board-grid`, `color-key`).
- Game colors are applied from `DEFAULT_COLORS` in board/keyboard components via inline `backgroundColor`.

## Quality Gates

- Test: `bun run test`
- Lint: `bun run lint`
- Build: `bun run build`
