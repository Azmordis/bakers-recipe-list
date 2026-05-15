import { createContext, useCallback, useContext, useMemo } from 'react';
import { useCookHistory } from '../hooks/useCookHistory.js';
import { useCookLog } from '../hooks/useCookLog.js';
import { usePinnedRecipes } from '../hooks/usePinnedRecipes.js';

const CookHistoryContext = createContext({
  madeSet: new Set(),
  toggleMade: () => {},
  cookLog: {},
  updateNotes: () => {},
  pinnedSet: new Set(),
  togglePinned: () => {},
});

export function CookHistoryProvider({ children }) {
  const [madeSet, toggleMadeRaw] = useCookHistory();
  const [cookLog, logCook, updateNotes] = useCookLog();
  const [pinnedSet, togglePinned] = usePinnedRecipes();

  // Wrap toggleMade so marking a recipe as made also logs the date.
  const toggleMade = useCallback((name) => {
    const wasAlreadyMade = madeSet.has(name);
    toggleMadeRaw(name);
    if (!wasAlreadyMade) logCook(name);
  }, [madeSet, toggleMadeRaw, logCook]);

  const value = useMemo(
    () => ({ madeSet, toggleMade, cookLog, updateNotes, pinnedSet, togglePinned }),
    [madeSet, toggleMade, cookLog, updateNotes, pinnedSet, togglePinned]
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
