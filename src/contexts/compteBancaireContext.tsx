import React, { createContext, useContext, useCallback, useState } from 'react';
import { updateCompteBancaire } from '../components/Api/compteBancaireService';
import {  UpdateCompteBancairePayload } from '../types/compeBanquaireType';

interface CompteBancaireContextType {
  updateCompte: (id: number, data: UpdateCompteBancairePayload) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

const CompteBancaireContext = createContext<CompteBancaireContextType | undefined>(undefined);

export const CompteBancaireProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCompte = useCallback(async (id: number, data: UpdateCompteBancairePayload) => {
    setLoading(true);
    setError(null);
    try {
      await updateCompteBancaire(id, data);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CompteBancaireContext.Provider value={{ updateCompte, loading, error }}>
      {children}
    </CompteBancaireContext.Provider>
  );
};

export const useCompteBancaire = (): CompteBancaireContextType => {
  const context = useContext(CompteBancaireContext);
  if (context === undefined) {
    throw new Error('useCompteBancaire must be used within a CompteBancaireProvider');
  }
  return context;
};
