# The Plan

> Note: large parts of this document are historical implementation notes.
> For the current source-of-truth architecture and lifecycle, use `docs/CODEBASE.md`.

## Current Status (2026-02-15)

### Completed Since Initial Plan

- Added maze gameplay support in React:
  - Maze presets (`Maze Easy`, `Maze Normal`, `Maze Hard`)
  - custom game mode toggle (`classic` / `maze`)
  - maze board model fields (`mode`, `walls`, `goal`)
  - unified win checks (`isBoardWon`)
- Added persistence module (`src/state/persistence.ts`):
  - versioned localStorage payload
  - sanitization/clamping for persisted values
  - persisted keys: `selectedColor`, `lastGameConfig`, `customSettings`
- Added Bun-native test suites:
  - `tests/utils/gameUtils.test.ts`
  - `tests/utils/gameFlow.test.ts`
  - `tests/state/persistence.test.ts`
- Replaced Vite with Bun-native web bundling/runtime:
  - dev server via `bun --hot index.html`
  - production build via `bun build index.html`
  - removed Vite-only config (`vite.config.ts`, `tsconfig.node.json`)
- Migrated styling from Tailwind utilities to upstream-inspired static CSS:
  - copied/adapted `floodit-js` stylesheet into `src/index.css`
  - updated React components to semantic class names (`panel`, `game-header`, `board-grid`, etc.)
- Updated welcome flow:
  - mode tabs (`Classic`/`Maze`)
  - mode-filtered difficulties
  - compact mobile-friendly layout

### Verification Snapshot

- `bun run test`: passing
- `bun run lint`: passing
- `bun run build`: passing

Entire plan of the game mostly written with Windsurf AI & OpenAI Codex since it is a game porting project.

## Game Analysis Summary

The original Flood It is a **GTK4 desktop application** written in Go with these core components:

- **Game Logic**: Board generation, flood fill algorithm, win/lose conditions
- **UI Framework**: GTK4 with Libadwaita for native desktop interface
- **Architecture**: Clean separation between backend logic and UI views
- **Key Features**: Multiple difficulty levels, color keyboard, step tracking

## Web App Architecture Plan

### **Technology Stack**
- **React** with hooks for state management and component architecture
- **Tailwind CSS** for responsive, utility-first styling
- **TypeScript** for type safety (migrated from the original Go)

### **Component Structure**
```
src/
├── components/
│   ├── GameBoard.tsx      # Main game grid
│   ├── ColorKeyboard.tsx  # Color selection interface
│   ├── GameHeader.tsx     # Header with progress and steps
│   ├── GameControls.tsx   # New game, reset, dark mode, source link
│   ├── Welcome.tsx        # Welcome screen and difficulty selection
│   ├── CustomGameMode.tsx # Custom game settings
│   ├── ConfirmDialog.tsx  # Confirmed actions (reset/new/quit)
│   └── GameOver.tsx       # End-of-game modal
├── hooks/
│   ├── useGameLogic.ts    # Core game state and flood algorithm
│   └── useDarkMode.ts     # Dark mode preference + DOM toggle
├── utils/
│   └── gameUtils.ts       # Board generation and flood fill
└── types/
    └── game.ts            # TypeScript interfaces
```

### **Core Game Logic Migration**

The Go backend logic will be ported to JavaScript/TypeScript:

1. **Board Structure**: Convert Go structs to TypeScript interfaces
2. **Flood Fill Algorithm**: Adapt the BFS-based flood algorithm
3. **Color System**: Maintain the same 6-color palette
4. **Step Calculation**: Port the max steps formula

### **UI/UX Design with Tailwind CSS**

- **Responsive Grid**: Use `grid-cols-*` and `grid-rows-*` for adaptive boards
- **Color Palette**: Implement the same hex colors as the original
- **Interactive Elements**: Hover states, transitions, and animations
- **Mobile-First**: Ensure touch-friendly interface

### **Key Features to Implement**

1. **Game Board**: Responsive grid with rounded corners
2. **Color Keyboard**: Visual color selection buttons
3. **Game States**: Welcome screen, playing, win/lose screens
4. **Difficulty Levels**: Easy, Normal, Hard with different board sizes
5. **Step Tracking**: Real-time display of remaining moves
6. **Restart Functionality**: Play again with same or new board

### **Advantages of Web Implementation**

- **Cross-platform**: Works on any device with a browser
- **No Installation**: Instant play without downloads
- **Shareable**: Easy to share game URLs
- **Responsive**: Adapts to mobile, tablet, desktop
- **Modern UI**: Smooth animations and interactions

This architecture maintains the core game mechanics while leveraging modern web technologies for broader accessibility and enhanced user experience.

## Implementation Status ✅

### **Completed Features**

#### **🏗️ Project Setup & Configuration**
- ✅ React + TypeScript project initialized
- ✅ Upstream-inspired static CSS styling integrated (`src/index.css`)
- ✅ Bun package manager configured
- ✅ Bun-native dev/build pipeline configured

#### **🎮 Core Game Logic**
- ✅ **Board Structure**: TypeScript interfaces for `Board`, `Position`, `GameColors`
- ✅ **Flood Fill Algorithm**: BFS-based algorithm ported from Go
- ✅ **Color System**: Original 6-color palette maintained
- ✅ **Step Calculation**: Max steps formula implemented
- ✅ **Random Seed**: Deterministic board generation

#### **🧩 Component Architecture**
- ✅ **GameBoard.tsx**: Responsive grid with dynamic cell sizing
- ✅ **ColorKeyboard.tsx**: Interactive color selection with hover effects
- ✅ **GameHeader.tsx**: Sticky header with progress, steps, and controls
- ✅ **GameControls.tsx**: New game and reset functionality (dropdown variant)
- ✅ **Game.tsx**: Main game component with state management

#### **🎨 UI/UX Implementation**
- ✅ **Responsive Design**: Mobile-first approach with breakpoints
- ✅ **Custom Colors**: Tailwind theme with game-specific colors
- ✅ **Interactive Elements**: Hover states, transitions, animations
- ✅ **Game States**: Welcome, playing, win, lose screens
- ✅ **Visual Feedback**: Color selection highlighting and step warnings
- ✅ **Sticky Header**: Always-visible game metadata and controls
- ✅ **Dark Mode**: Theme toggle with persisted preference

#### **🎯 Game Features**
- ✅ **Difficulty Levels**: Easy (6×6), Normal (10×10), Hard (14×14)
- ✅ **Step Tracking**: Real-time display with low-step warnings
- ✅ **Win/Lose Conditions**: Proper game state detection
- ✅ **Reset Functionality**: Confirmed reset generates a fresh board with the same settings
- ✅ **New Game**: Start fresh games with different difficulties

#### **⚡ Performance & Development**
- ✅ **Custom Hooks**: `useGameLogic` for state management
- ✅ **Theme Hook**: `useDarkMode` for dark-mode preference and DOM updates
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Hot Reload**: Bun HTML dev server (`bun --hot`) with React refresh
- ✅ **Code Organization**: Clean separation of concerns

### **Technical Implementation Details**

#### **Styling Configuration**
`src/index.css` uses a semantic class system adapted from `floodit-js` (for example `panel`, `btn`, `game-header`, `board-grid`, `color-key`) and CSS variables for light/dark theming.

#### **Bun Pipeline Configuration**
```json
{
  "scripts": {
    "dev": "bun --hot --port 5173 index.html",
    "build": "bun build --target=browser --outdir=dist --splitting --sourcemap --minify index.html",
    "preview": "bun --hot --port 4173 dist/index.html"
  }
}
```

#### **Game Algorithm**
- **Flood Fill**: Breadth-First Search (BFS) algorithm
- **Board Generation**: Seeded random number generator
- **Win Detection**: Uniform color check across all cells
- **Step Limit**: Formula: `30 * (rows * colors) / (17 * 6)`

### **Current Status: 🎮 FULLY FUNCTIONAL**

The Flood It web game is now complete and playable with the Bun dev server (`bun run dev`, default port `5173` when available) with all original features successfully ported to modern web technologies.

### **Recent Additions (TanStack Start parity)**
- **GameHeader + GameControls**: Progress bar, step urgency, and gameplay controls in a sticky header
- **Dark mode**: Toggle in the header, persisted in `localStorage`, with early inline script in `index.html` to prevent flash
- **GameControls dropdown**: New Game with difficulty list + Reset button styling
- **Welcome screen refresh**: “How to Play” panel and dark-mode-ready layout
- **Dependency**: `lucide-react` for dark-mode toggle icons

### **Latest Implementation Updates**
- **Custom Game Mode**: Full implementation with board size (5×5 to 25×25) and custom move limits
  - Interactive sliders for board size and move limit configuration
  - Real-time game settings preview
  - Seamless integration with existing game flow
- **Confirmation Dialog Flow**: Confirmation prompts for reset and new game actions
  - Distinct messages for reset vs new game
  - Custom game currently bypasses confirmation and opens settings directly
- **Difficulty Alignment**: Updated to match original Go version parameters
  - Easy: 6×6 board with 15 moves
  - Normal: 10×10 board with 20 moves
  - Hard: 14×14 board with 25 moves
  - Proper move limit integration with game logic
- **Bun Migration**: Complete transition from npm to Bun
  - Replaced Vite scripts/config with Bun dev/build/preview scripts
  - Removed Tailwind build/watch script in favor of static CSS
  - Updated docs and quality gates for Bun-native workflow

### **Recent Fixes**
- **Game Over restart**: Removed full page reload and restart via in-app flow
- **Confirmation prompts**: Distinct copy for reset vs new game
- **Keyboard shortcuts**: Added `Alt+Shift+R` (reset), `Alt+Shift+N` (new board with current settings), and `Alt+Shift+Q` (quit to welcome) with confirmation dialogs
- **Welcome screen shortcut guide**: Added a dedicated keyboard shortcuts section to improve discoverability
- **Flood-fill correctness**: Updated BFS to also absorb connected cells that already match the selected color
- **Dark mode hook stability**: Refactored initialization to remove effect-driven state updates and satisfy strict hook linting
- **Color keyboard memo cleanup**: Removed stale dependency warning by inlining gap calculation in memoized layout
- **Reset behavior correction**: Confirmed reset now regenerates the board with a new random seed instead of recreating the same matrix
- **Seed readability refactor**: Replaced seed magic numbers with `AUTO_GENERATE_SEED` in game logic utilities
- **Quality gate**: `bun run lint` and `bun run build` now pass after the latest fixes

### **Recent UI/UX Enhancements**
- **Modal Game Over Screen**: Beautiful modal interface with animations
  - Smooth fade and scale transitions
  - Backdrop click to close functionality
  - Enhanced game statistics display
  - Action buttons for new game and close (no full page reload)
- **Mobile-Optimized Header**: Compact and responsive design
  - Reduced height from ~112px to ~60px (47% reduction)
  - Mobile-first responsive layout with essential info prioritization
  - Container centering with max-width constraints
  - Adaptive progress bar (hidden on mobile, visible on desktop)
- **Mobile-Friendly Controls**: Touch-optimized button design
  - Compact horizontal layout on all screen sizes
  - Smart text labels (symbols on mobile, text on desktop)
  - Active press feedback with scale animations
  - Responsive padding and sizing for better touch targets
- **Dynamic Color Keyboard**: Adaptive sizing based on board difficulty
  - Easy (6×6): 25% larger buttons for accessibility
  - Normal (10×10): Standard balanced sizing
  - Hard (14×14): 12.5% smaller buttons for space efficiency
  - Custom/Large: Compact sizing for maximum board visibility
- **Responsive Game Board Scaling**: Grid now sizes based on viewport and container
  - Uses mobile-friendly width/height caps with aspect-ratio preservation
  - Board can expand to fill available width on small screens
  - Desktop height cap reserves space so the color keyboard stays visible
- **Color Keyboard Layout Sync**: Button sizing now reacts to available space
  - Measures container width for consistent fit on mobile
  - Scales button size with board size for better usability

### **Responsive Sizing Rules**
- **Board width cap**: 90% of viewport width (and container width if smaller)
- **Board height cap**: 90% of viewport height on mobile, 65% on desktop (>= 1024px)
- **Max board size**: 900px on either dimension
- **Aspect ratio**: Preserved based on rows/columns
  - Responsive gaps and padding per board size

### **Future Enhancements (Optional)**
- ✅ ⌨️ **Keyboard Shortcuts**: Alt+Shift+R (restart), Alt+Shift+N (new game), Alt+Shift+Q (quit)
- 📖 **Help/Rules Page**: Dedicated game instructions and controls guide
- 🔔 **Toast Notifications**: User feedback for actions and errors
- 🌐 **Internationalization**: Multi-language support for broader accessibility
- 🎵 **Sound Effects**: Audio feedback for moves and win/lose states
- 🏆 **High Score Tracking**: Persistent leaderboard and best scores
- 🎨 **Custom Color Themes**: Alternative color palettes and themes
- 📱 **PWA Support**: Offline play and app-like experience
- 🔄 **Undo/Redo**: Move history and reversal functionality
- 📊 **Game Statistics**: Detailed analytics and performance metrics
