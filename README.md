# Flood It React

A modern web implementation of the classic Flood It puzzle game, built with React, TypeScript, and Tailwind CSS.

[Demo](https://floodit-react.vercel.app/)

## Features

- 🎮 **Classic Gameplay**: Flood the entire board with one color in limited moves
- 🎯 **Multiple Difficulties**: Easy (6×6), Normal (10×10), Hard (14×14)
- ⚙️ **Custom Game Mode**: Create your own board size and move limits
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Instant Play**: No installation required, runs in any modern browser

## Getting Started

This project uses [Bun](https://bun.sh) as the package manager and runtime.

### Prerequisites

- [Bun](https://bun.sh) installed on your system

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

### Build

```bash
bun build
```

### Lint

```bash
bun lint
```

### Preview

```bash
bun preview
```

## How to Play

1. **Start from the top-left corner** (already highlighted)
2. **Select colors** from the color keyboard at the bottom
3. **Flood connected areas** with your chosen color
4. **Fill the entire board** with one color before running out of moves
5. **Complete in minimum moves** for the best efficiency score

### Controls

- **Color Selection**: Click color buttons or use keyboard shortcuts (1-6)
- **New Game**: Click "New Game" dropdown and select difficulty
- **Reset**: Click "Reset" to restart the current board
- **Dark Mode**: Toggle with the moon/sun icon

## Game Modes

### Standard Difficulties
- **Easy**: 6×6 board, 15 moves
- **Normal**: 10×10 board, 20 moves  
- **Hard**: 14×14 board, 25 moves

### Custom Mode
- **Board Size**: 5×5 to 25×25
- **Move Limit**: Custom or auto-calculated
- **Perfect for**: Creating your own challenge level

## Technology Stack

- **React 19** - Modern UI framework
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS v4** - Utility-first styling with custom theme
- **Vite** - Fast development and build tool
- **Bun** - Package manager and runtime

## Recent Updates

### 🎮 Enhanced User Experience
- **Modal Game Over Screen**: Beautiful modal with animations and action buttons
- **Mobile-Optimized Header**: Compact design with responsive layout
- **Mobile-Friendly Controls**: Touch-optimized buttons with smart sizing
- **Dynamic Color Keyboard**: Adaptive button sizes based on board difficulty
- **Responsive Game Board**: Grid scales to viewport/container size with aspect ratio preserved

### 📱 Mobile Improvements
- **Responsive Header**: Adapts from compact mobile to full desktop layout
- **Touch-Optimized Buttons**: Larger touch targets and press feedback
- **Smart Button Labels**: Symbols on mobile, text on desktop
- **Adaptive Color Keys**: Larger buttons for easy boards, compact for hard boards
- **Board + Keyboard Visibility**: Desktop height cap keeps controls visible without scrolling

### 🎨 UI/UX Enhancements
- **Container Centering**: Proper max-width containers for better alignment
- **Smooth Animations**: Scale transitions and hover effects
- **Dark Mode Support**: Consistent theming across all components
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Project Structure

```
src/
├── components/          # React components
│   ├── Game.tsx         # Main game component
│   ├── GameBoard.tsx    # Game grid rendering
│   ├── ColorKeyboard.tsx # Color selection interface (adaptive sizing)
│   ├── GameHeader.tsx   # Compact header with progress and controls
│   ├── GameControls.tsx  # Mobile-friendly game controls
│   ├── GameOver.tsx     # Modal game over screen
│   ├── CustomGameMode.tsx # Custom game settings
│   └── Welcome.tsx      # Welcome screen with difficulty selection
├── hooks/               # Custom React hooks
│   ├── useGameLogic.ts  # Core game state management
│   └── useDarkMode.ts   # Dark mode functionality
├── utils/               # Utility functions
│   └── gameUtils.ts     # Game logic and algorithms
├── types/               # TypeScript type definitions
│   └── game.ts          # Game-related interfaces
└── assets/              # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `bun lint` to check for issues
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

Based on the original [Flood It](https://github.com/tfuxu/floodit) GTK desktop application by tfuxu.

Game algorithm inspired by [Open Flood](https://github.com/GunshipPenguin/open_flood) and [The FloodIt! game](https://otfried.org/scala/floodit.html) by Otfried Cheong.

Thanks [Windsurf IDE](https://windsurf.com), [OpenAI Codex](https://openai.com/codex/) and their AI assistants for helping with the implementation.
