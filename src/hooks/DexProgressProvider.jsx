import {useEffect, useMemo, useState} from 'react';
import {DexProgressContext} from './DexProgressContext';

const STORAGE_KEY = 'pokedex-progress';

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      seen: saved?.seen ?? [],
      caught: saved?.caught ?? [],
      autoVoice: saved?.autoVoice ?? false,
    };
  } catch {
    return {seen: [], caught: [], autoVoice: false};
  }
}

function DexProgressProvider({children}) {
  const [progress, setProgress] = useState(readProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Sin almacenamiento (modo privado): el progreso solo dura esta sesión.
    }
  }, [progress]);

  const value = useMemo(
    () => ({
      seen: new Set(progress.seen),
      caught: new Set(progress.caught),
      autoVoice: progress.autoVoice,
      markSeen: (id) =>
        setProgress((current) =>
          current.seen.includes(id) ? current : {...current, seen: [...current.seen, id]},
        ),
      toggleCaught: (id) =>
        setProgress((current) =>
          current.caught.includes(id)
            ? {...current, caught: current.caught.filter((caughtId) => caughtId !== id)}
            : {
                ...current,
                caught: [...current.caught, id],
                seen: current.seen.includes(id) ? current.seen : [...current.seen, id],
              },
        ),
      toggleAutoVoice: () =>
        setProgress((current) => ({...current, autoVoice: !current.autoVoice})),
    }),
    [progress],
  );

  return <DexProgressContext.Provider value={value}>{children}</DexProgressContext.Provider>;
}

export default DexProgressProvider;
