import { describe, expect, test } from 'bun:test';
import {
  STORAGE_KEY,
  STORAGE_VERSION,
  loadPersistedState,
  sanitizePersistedSnapshot,
  savePersistedState,
} from '../../src/state/persistence';

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
  };
}

describe('state/persistence', () => {
  test('savePersistedState writes versioned payload', () => {
    const storage = createMemoryStorage();

    savePersistedState(
      {
        selectedColor: 'blue',
        lastGameConfig: null,
        customSettings: {
          gameMode: 'classic',
          boardSize: 10,
          customMoveLimit: false,
          moveLimit: 20,
        },
      },
      storage,
    );

    const stored = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null');
    expect(stored.version).toBe(STORAGE_VERSION);
    expect(stored.data.selectedColor).toBe('blue');
    expect(stored.data.customSettings.boardSize).toBe(10);
  });

  test('loadPersistedState returns null on malformed json', () => {
    const storage = createMemoryStorage();
    storage.setItem(STORAGE_KEY, '{invalid');

    expect(loadPersistedState(storage)).toBeNull();
  });

  test('sanitizePersistedSnapshot clamps and validates values', () => {
    const sanitized = sanitizePersistedSnapshot({
      version: STORAGE_VERSION,
      data: {
        selectedColor: 'invalid-color',
        lastGameConfig: {
          type: 'custom',
          settings: {
            gameMode: 'maze',
            boardSize: 100,
            customMoveLimit: true,
            moveLimit: 999,
          },
        },
        customSettings: {
          gameMode: 'maze',
          boardSize: 1,
          customMoveLimit: true,
          moveLimit: 1000,
        },
      },
    });

    expect(sanitized).not.toBeNull();
    expect(sanitized?.selectedColor).toBe('');
    expect(sanitized?.customSettings).toEqual({
      gameMode: 'maze',
      boardSize: 5,
      customMoveLimit: true,
      moveLimit: 100,
    });
    expect(sanitized?.lastGameConfig).toEqual({
      type: 'custom',
      settings: {
        gameMode: 'maze',
        boardSize: 25,
        customMoveLimit: true,
        moveLimit: 100,
      },
    });
  });

  test('sanitizePersistedSnapshot validates difficulty config', () => {
    const sanitized = sanitizePersistedSnapshot({
      version: STORAGE_VERSION,
      data: {
        selectedColor: 'red',
        lastGameConfig: {
          type: 'difficulty',
          difficulty: {
            name: '',
            rows: -5,
            columns: 100,
            maxSteps: 9999,
            mode: 'maze',
          },
        },
        customSettings: {
          gameMode: 'classic',
          boardSize: 12,
          customMoveLimit: false,
          moveLimit: 20,
        },
      },
    });

    expect(sanitized?.selectedColor).toBe('red');
    expect(sanitized?.lastGameConfig).toEqual({
      type: 'difficulty',
      difficulty: {
        name: 'Custom',
        rows: 1,
        columns: 25,
        maxSteps: 500,
        mode: 'maze',
      },
    });
  });

  test('loadPersistedState returns sanitized snapshot', () => {
    const storage = createMemoryStorage();

    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        data: {
          selectedColor: 'green',
          lastGameConfig: null,
          customSettings: {
            gameMode: 'classic',
            boardSize: 12,
            customMoveLimit: false,
            moveLimit: 20,
          },
        },
      }),
    );

    const loaded = loadPersistedState(storage);
    expect(loaded).toEqual({
      selectedColor: 'green',
      lastGameConfig: null,
      customSettings: {
        gameMode: 'classic',
        boardSize: 12,
        customMoveLimit: false,
        moveLimit: 20,
      },
    });
  });
});
