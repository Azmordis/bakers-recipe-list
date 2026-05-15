import { createContext, useCallback, useContext, useMemo } from 'react';
import { useCookHistory } from '../hooks/useCookHistory.js';
import { useCookLog } from '../hooks/useCookLog.js';

const CookHistoryContext = createContext({
  madeSet: new Set(),
  toggleMade: () => {},
  cookLog: {},
  updateNotes: () => {},
});

export function CookHistoryProvider({ children }) {
  const [madeSet, toggleMadeRaw] = useCookHistory();
  const [cookLog, logCook, updateNotes] = useCookLog();

  // Wrap toggleMade so marking a recipe as made also logs the date.
  // Unmarking does NOT remove log entries — history is preserved.
  const toggleMade = useCallback((name) => {
    const wasAlreadyMade = madeSet.has(name);
    toggleMadeRaw(name);
    if (!wasAlreadyMade) {
      logCook(name);
    }
  }, [madeSet, toggleMadeRaw, logCook]);

  const value = useMemo(
    () => ({ madeSet, toggleMade, cookLog, updateNotes }),
    [madeSet, toggleMade, cookLog, updateNotes]
  );

  return (
    <CookHistoryContext.Provider value={value}>
      {children}
    </CookHistoryContext.Provider>
  );
}

export function useCookHistoryContext() {
  return useContext(CookHistoryContext);
}
