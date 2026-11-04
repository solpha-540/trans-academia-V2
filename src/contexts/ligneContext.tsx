import React, { createContext, useContext, useEffect, useState } from "react";
import { Ligne, LignePayload } from "../types/ligneType";
import { createLigne, getLignes } from "../components/Api/ligneService";

type LigneContextType = {
  lignes: Ligne[];
  loadingLigne: boolean;
  errorLigne: string | null;
  refreshLignes: () => void;
  addLigne: (data: LignePayload) => Promise<void>;
};

const LigneContext = createContext<LigneContextType | undefined>(undefined);

export const LigneProvider = ({ children }: { children: React.ReactNode }) => {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [loadingLigne, setLoadingLigne] = useState<boolean>(true);
  const [errorLigne, setErrorLigne] = useState<string | null>(null);

  const fetchLignes = async () => {
    try {
      setLoadingLigne(true);
      const data = await getLignes();
      setLignes(data);
      setErrorLigne(null);
    } catch (err: any) {
      setErrorLigne("Erreur de chargement des lignes.");
    } finally {
      setLoadingLigne(false);
    }
  };

  const addLigne = async (data: LignePayload) => {
    await createLigne(data);
    await fetchLignes();
  };

  useEffect(() => {
    fetchLignes();
  }, []);

  return (
    <LigneContext.Provider
      value={{
        lignes,
        loadingLigne,
        errorLigne,
        refreshLignes: fetchLignes,
        addLigne,
      }}
    >
      {children}
    </LigneContext.Provider>
  );
};

export const useLigneContext = () => {
  const context = useContext(LigneContext);
  if (!context) {
    throw new Error("useLigneContext doit être utilisé dans un LigneProvider");
  }
  return context;
};
