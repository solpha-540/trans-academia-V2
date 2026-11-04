import React, { createContext, useContext, useEffect, useState } from "react";
import { Conjoint, ConjointPayload } from "../types/conjointType";
import { createConjoint, getConjoints } from "../components/Api/conjointService";

type ConjointContextType = {
  conjoints: Conjoint[];
  loadingConjoint: boolean;
  errorConjoint: string | null;
  refreshConjoints: () => void;
  addConjoint: (data: ConjointPayload) => Promise<void>;
};

const ConjointContext = createContext<ConjointContextType | undefined>(undefined);

export const ConjointProvider = ({ children }: { children: React.ReactNode }) => {
  const [conjoints, setConjoints] = useState<Conjoint[]>([]);
  const [loadingConjoint, setLoadingConjoint] = useState<boolean>(true);
  const [errorConjoint, setErrorConjoint] = useState<string | null>(null);

  const fetchConjoints = async () => {
    try {
      setLoadingConjoint(true);
      const data = await getConjoints();
      setConjoints(data);
      setErrorConjoint(null);
    } catch (err: any) {
      setErrorConjoint("Erreur de chargement des conjoints.");
    } finally {
      setLoadingConjoint(false);
    }
  };

  const addConjoint = async (data: ConjointPayload) => {
    await createConjoint(data);
    await fetchConjoints();
  };

  useEffect(() => {
    fetchConjoints();
  }, []);

  return (
    <ConjointContext.Provider
      value={{
        conjoints,
        loadingConjoint,
        errorConjoint,
        refreshConjoints: fetchConjoints,
        addConjoint,
      }}
    >
      {children}
    </ConjointContext.Provider>
  );
};

export const useConjointContext = () => {
  const context = useContext(ConjointContext);
  if (!context) {
    throw new Error("useConjointContext doit être utilisé dans un ConjointProvider");
  }
  return context;
};
