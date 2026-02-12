# FloodIt React Codebase Guide

This document explains how the project is organized, how game state flows through the app, and where to make common changes safely.

## High-Level Architecture

The app uses React component state with a mostly unidirectional flow:

1. User interacts with UI in `src/components/*`.
2. `Game.tsx` handles screen-level intent (new game, reset, confirm, custom mode, shortcuts).
3. `useGameLogic` (`src/hooks/useGameLogic.ts`) computes board/game transitions using `src/utils/gameUtils.ts`.
4. React rerenders components from updated state.

## Entry Points

- `index.html`: bootstraps dark mode preference early via `/scripts/darkMode.js`.
- `src/main.tsx`: mounts `<App />` in `StrictMode`.
- `src/App.tsx`: renders the root game component.
- `src/components/Game.tsx`: application orchestrator for view switching and global flows.

## Core Modules

- `src/utils/gameUtils.ts`
  - Pure game helpers and constants.
  - `DEFAULT_COLORS`, `DIFFICULTIES`, board initialization, flood-fill, move-limit helpers, win check.

- `src/hooks/useGameLogic.ts`
  - Encapsulates board lifecycle and move processing.
  - Exposes `startNewGame`, `startCustomGame`, `makeMove`, `resetGame`, `quitGame`, and computed flags.

- `src/components/Game.tsx`
  - Coordinates app-level UI state not owned by `useGameLogic`:
    - `showCustomMode`
    - `showGameOverModal`
    - confirm dialog lifecycle (`showConfirmDialog`, `pendingAction`, `confirmDialogContent`)
    - `lastGameConfig` for "new round with current settings"
    - persisted custom setup defaults (`customSettings`)
  - Registers global keyboard shortcuts.

- `src/components/*`
  - Presentation and local interaction layers:
  - `Welcome.tsx`, `CustomGameMode.tsx`, `GameHeader.tsx`, `GameControls.tsx`, `GameBoard.tsx`, `ColorKeyboard.tsx`, `ConfirmDialog.tsx`, `GameOver.tsx`.

- `src/hooks/useDarkMode.ts` + `public/scripts/darkMode.js`
  - Dark mode preference and DOM class management.
  - Early script prevents flash of incorrect theme before React hydration.

## State Shape (App-Level)

Managed in `src/components/Game.tsx`:

- `showCustomMode`
- `showGameOverModal`
- `showConfirmDialog`
- `pendingAction`
- `confirmDialogContent`
- `lastGameConfig`
- `customSettings` (`boardSize`, `customMoveLimit`, `moveLimit`)

Managed in `src/hooks/useGameLogic.ts`:

- `board`
- `selectedColor`
- computed values: `stepsLeft`, `isGameOver`, `hasWon`

## Game Lifecycle

### Start Flow

1. Difficulty/custom selected from welcome or header menu.
2. `startNewGame` or `startCustomGame` initializes board.
3. Transient UI state is reset (selection, modals as needed).
4. Gameplay screen renders with current board.

### Move Flow

1. Player chooses a color in `ColorKeyboard`.
2. `makeMove(color)` validates state and applies `flood`.
3. Hook updates board and returns progression state:
   - `playing`
   - `won`
   - `lost`
4. `Game.tsx` opens game-over modal on win/loss.

### Confirmed Actions

Reset/new/quit use a shared confirm dialog:

1. Set `pendingAction` and dialog content.
2. Open confirm dialog.
3. On confirm: execute `pendingAction`, then close dialog through one centralized close path.
4. On cancel: close dialog and clear `pendingAction`.

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

## Styling

- Tailwind CSS v4 via `src/index.css`.
- Game color tokens are defined in `@theme`.
- Components use utility classes; no CSS modules currently.

## Quality Gates

- Lint: `bun run lint`
- Build: `bun run build`

There are no committed automated tests yet.
