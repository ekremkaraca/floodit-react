import type { CustomGameSettings, Difficulty } from '../types/game';
import type { LastGameConfig } from '../utils/gameFlow';
import { DEFAULT_COLORS } from '../utils/gameUtils';

export const STORAGE_KEY = 'floodit-react.state.v1';
export const STORAGE_VERSION = 1;

const VALID_COLORS = new Set(DEFAULT_COLORS.map((color) => color.name));

export interface PersistedState {
  selectedColor: string;
  lastGameConfig: LastGameConfig;
  customSettings: CustomGameSettings;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toSafeInteger(value: unknown, fallback: number, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.trunc(n);
  return Math.min(max, Math.max(min, i));
}

function sanitizeDifficulty(value: unknown): Difficulty | null {
  if (!isPlainObject(value)) return null;

  const rows = toSafeInteger(value.rows, 10, 1, 25);
  const columns = toSafeInteger(value.columns, 10, 1, 25);
  const maxSteps = toSafeInteger(value.maxSteps ?? 0, 0, 0, 500);

  return {
    name: typeof value.name === 'string' && value.name.length > 0 ? value.name : 'Custom',
    rows,
    columns,
    maxSteps,
  };
}

function sanitizeCustomSettings(value: unknown): CustomGameSettings {
  if (!isPlainObject(value)) {
    return {
      boardSize: 10,
      customMoveLimit: false,
      moveLimit: 20,
    };
  }

  return {
    boardSize: toSafeInteger(value.boardSize, 10, 5, 25),
    customMoveLimit: Boolean(value.customMoveLimit),
    moveLimit: toSafeInteger(value.moveLimit, 20, 5, 100),
  };
}

function sanitizeLastGameConfig(value: unknown): LastGameConfig {
  if (!isPlainObject(value)) return null;

  if (value.type === 'difficulty') {
    const difficulty = sanitizeDifficulty(value.difficulty);
    if (!difficulty) return null;
    return { type: 'difficulty', difficulty };
  }

  if (value.type === 'custom') {
    return {
      type: 'custom',
      settings: sanitizeCustomSettings(value.settings),
    };
  }

  return null;
}

export function sanitizePersistedSnapshot(raw: unknown): PersistedState | null {
  if (!isPlainObject(raw)) return null;
  if (raw.version !== STORAGE_VERSION || !isPlainObject(raw.data)) {
    return null;
  }

  const data = raw.data;
  const selectedColor = typeof data.selectedColor === 'string' && VALID_COLORS.has(data.selectedColor)
    ? data.selectedColor
    : '';

  return {
    selectedColor,
    lastGameConfig: sanitizeLastGameConfig(data.lastGameConfig),
    customSettings: sanitizeCustomSettings(data.customSettings),
  };
}

export function loadPersistedState(storage: Pick<Storage, 'getItem'> | null = globalThis.localStorage): PersistedState | null {
  if (!storage) return null;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return sanitizePersistedSnapshot(parsed);
  } catch {
    return null;
  }
}

function toPersistedData(state: PersistedState): PersistedState {
  return {
    selectedColor: state.selectedColor,
    lastGameConfig: state.lastGameConfig,
    customSettings: state.customSettings,
  };
}

export function savePersistedState(
  state: PersistedState,
  storage: Pick<Storage, 'setItem'> | null = globalThis.localStorage
): void {
  if (!storage) return;

  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        data: toPersistedData(state),
      }),
    );
  } catch {
    // Ignore quota/private-mode errors.
  }
}
