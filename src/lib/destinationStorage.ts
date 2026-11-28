import { useMemo, useSyncExternalStore } from 'react';
import type { SetStateAction } from 'react';

type Value<T> = T | null | undefined;

function parse<T>(raw: string | null | undefined): Value<T> {
  if (raw == null) return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function createLocalStorageStore<T>(key: string) {
  const listeners = new Set<() => void>();
  const getSnapshot = () => window.localStorage.getItem(key);
  const getServerSnapshot = () => undefined;

  function subscribe(listener: () => void) {
    listeners.add(listener);
    function onStorage(event: StorageEvent) {
      if (
        event.storageArea === window.localStorage &&
        (event.key === key || event.key === null)
      ) {
        listener();
      }
    }
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  }

  function useValue(): Value<T> {
    const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return useMemo(() => parse<T>(raw), [raw]);
  }

  function setValue(update: SetStateAction<Value<T>>) {
    const value =
      typeof update === 'function'
        ? (update as (previous: Value<T>) => Value<T>)(parse<T>(getSnapshot()))
        : update;
    if (value === undefined) return;
    window.localStorage.setItem(key, JSON.stringify(value));
    for (const listener of listeners) listener();
  }

  return { useValue, setValue };
}
