import {createContext, useContext} from 'react';

export const DexProgressContext = createContext(null);

export const useDexProgress = () => useContext(DexProgressContext);
