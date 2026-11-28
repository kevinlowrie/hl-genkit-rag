import { useState, useSyncExternalStore } from 'react';
import type { SetStateAction } from 'react';

type Value<T> = T | null | undefined;

const unsavedSelections = new Map<string, unknown>();

function readFromStorage<T>(key: string): Value<T> {
  if (typeof window === 'undefined') return undefined;
  if (unsavedSelections.has(key)) return unsavedSelections.get(key) as T | null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function createStore<T>(key: string) {
  // Read once per mount so another tab cannot replace an itinerary in use.
  let value = readFromStorage<T>(key);
  const listeners = new Set<() => void>();
  const getSnapshot = () => value;
  const getServerSnapshot = () => undefined;

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function setValue(update: SetStateAction<Value<T>>) {
    const next =
      typeof update === 'function'
        ? (update as (previous: Value<T>) => Value<T>)(value)
        : update;
    if (Object.is(next, value)) return;

    value = next;
    if (next !== undefined && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
        unsavedSelections.delete(key);
      } catch {
        // A new page in this document can still use the unsaved selection.
        unsavedSelections.set(key, next);
      }
    }
    for (const listener of listeners) listener();
  }

  return { subscribe, getSnapshot, getServerSnapshot, setValue };
}

export function useDestinationStorage<T>(key: string) {
  const [store] = useState(() => createStore<T>(key));
  const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  return [value, store.setValue] as const;
}
