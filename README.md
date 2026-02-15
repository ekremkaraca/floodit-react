# Flood It React

Modern web implementation of Flood It, built with React + TypeScript.

[Demo](https://floodit-react.vercel.app/)

Reference projects:
- [floodit-js](https://github.com/ekremkaraca/floodit-js) (vanilla JS)
- [floodit-sveltekit](https://github.com/ekremkaraca/floodit-sveltekit)

## Features

- Classic mode and Maze mode gameplay
- Presets:
  - Classic: Easy (6x6), Normal (10x10), Hard (14x14)
  - Maze: Maze Easy (10x10), Maze Normal (12x12), Maze Hard (14x14)
- Custom mode with mode toggle (`classic` / `maze`)
- Confirmed actions (reset/new/quit)
- Dark mode with persisted preference
- Keyboard shortcuts: `Alt+Shift+R`, `Alt+Shift+N`, `Alt+Shift+Q`
- Bun-native automated tests

## Stack

- React 19
- TypeScript
- Bun bundler/runtime

## Build Pipeline

- CSS: static stylesheet in `src/index.css` (adapted from `floodit-js`)
- Dev server: Bun serves `index.html` with hot reload
- Production bundle: Bun bundles from `index.html` into `dist/`

## Getting Started

### Prerequisites

- [Bun](https://bun.sh)

### Install

```bash
bun install
```

### Run Dev Server

```bash
bun run dev
```

### Build

```bash
bun run build
```

### Type Check

```bash
bun run typecheck
```

### Lint

```bash
bun run lint
```

### Test

```bash
bun run test
```

### Preview Build

```bash
bun run preview
```

## How To Play

### Classic

1. Start from the top-left corner.
2. Select colors to expand connected region.
3. Fill the board with one color before moves run out.

### Maze

1. Start from the top-left corner.
2. Walls block flood expansion.
3. Reach the `G` goal tile before moves run out.

## Project Structure

```text
src/
├── components/           # UI components and screens
├── hooks/                # React hooks (game logic + dark mode)
├── state/                # Persistence (versioned localStorage)
├── types/                # Domain types
└── utils/                # Pure game engine + flow utilities

tests/
├── state/                # Persistence tests
└── utils/                # Engine/flow tests
```

## Architecture Docs

- `docs/CODEBASE.md`: current architecture, lifecycle, state, persistence, testing
- `docs/PLAN.md`: roadmap/history notes

## Quality Gates

- `bun run test`
- `bun run lint`
- `bun run build`

## License

MIT ([LICENSE](LICENSE))

## Acknowledgments

## Acknowledgments

Based on the original [Flood It](https://github.com/tfuxu/floodit) GTK app by tfuxu.

Inspired by:
- [Open Flood](https://github.com/GunshipPenguin/open_flood)
- [The FloodIt! game](https://otfried.org/scala/floodit.html) by Otfried Cheong

Thanks [Windsurf IDE](https://windsurf.com), [OpenAI Codex](https://openai.com/codex/) and their AI assistants for helping with the implementation.
