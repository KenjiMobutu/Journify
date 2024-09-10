import { createContext, useContext } from 'react';

const PersistorContext = createContext(null);

export const PersistorProvider = ({ persistor, children }) => {
  return (
    <PersistorContext.Provider value={persistor}>
      {children}
    </PersistorContext.Provider>
  );
};

// Utiliser le contexte dans d'autres composants
export const usePersistor = () => useContext(PersistorContext);
