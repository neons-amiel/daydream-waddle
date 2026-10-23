'use client'
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

/**
 * Drop-in replacement for useState that also saves to localStorage,
 * so values survive tab switches, refreshes and closing the browser.
 * Only clearing site data / browsing history wipes it.
 *
 *   const [salary, setSalary] = usePersistentState('adult:salary', '');
 */

const PREFIX = 'daydream:v1:';

// In-memory copy of everything written this session. Reads check this first,
// so the app keeps working even if localStorage is blocked (some private modes).
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function readRaw(key: string): string | null {
  if (memory.has(key)) return memory.get(key)!;
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function usePersistentState<T>(key: string, initial: T) {
  // Lock in the first `initial` so passing [] or {} inline stays the same object
  const [fallback] = useState(initial);

  // Server render (and hydration) use `null` → initial value,
  // then React swaps in the saved value. No hydration errors.
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null
  );

  const value = useMemo(() => parse(raw, fallback), [raw, fallback]);

  const setValue = useCallback(
    (action: T | ((prev: T) => T)) => {
      const prev = parse(readRaw(key), fallback);
      const next = typeof action === 'function' ? (action as (p: T) => T)(prev) : action;
      const json = JSON.stringify(next);
      memory.set(key, json);
      try {
        window.localStorage.setItem(PREFIX + key, json);
      } catch {
        // storage full or blocked: the in-memory copy still works for this visit
      }
      listeners.forEach((l) => l());
    },
    [key, fallback]
  );

  return [value, setValue] as const;
}