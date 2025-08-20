"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function usePersistentState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      if (stickyValue !== null && stickyValue !== 'undefined') {
        setState(JSON.parse(stickyValue));
      }
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      setState(defaultValue);
    } finally {
        setIsHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (isHydrated) {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }
  }, [key, state, isHydrated]);

  return [state, setState];
}

export default usePersistentState;
