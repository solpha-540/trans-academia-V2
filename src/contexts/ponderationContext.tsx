import React, { createContext, useContext, useEffect, useState } from "react";
import { Ponderation, PonderationPayload } from "../types/ponderationType";
import { getPonderations, createPonderation } from "../components/Api/ponderationService";

type PonderationContextType = {
  ponderations: Ponderation[];
  loadingPonderation: boolean;
  errorPonderation: string | null;
  refreshPonderations: () => void;
  createNewPonderation: (payload: PonderationPayload) => Promise<void>;
};

const PonderationContext = createContext<PonderationContextType | undefined>(undefined);

export const PonderationProvider = ({ children }: { children: React.ReactNode }) => {
  const [ponderations, setPonderations] = useState<Ponderation[]>([]);
  const [loadingPonderation, setLoading] = useState<boolean>(true);
  const [errorPonderation, setErrorPonderation] = useState<string | null>(null);

  const fetchPonderations = async () => {
    try {
      setLoading(true);
      const data = await getPonderations();
      setPonderations(data);
      setErrorPonderation(null);
    } catch (err: any) {
      setErrorPonderation("Erreur de chargement des pondérations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPonderations();
  }, []);

  const createNewPonderation = async (payload: PonderationPayload) => {
    await createPonderation(payload);
    await fetchPonderations();
  };

  return (
    <PonderationContext.Provider
      value={{
        ponderations,
        loadingPonderation,
        errorPonderation,
        refreshPonderations: fetchPonderations,
        createNewPonderation,
      }}
    >
      {children}
    </PonderationContext.Provider>
  );
};

export const usePonderationContext = () => {
  const context = useContext(PonderationContext);
  if (!context) {
    throw new Error("usePonderationContext doit être utilisé dans un PonderationProvider");
  }
  return context;
};
