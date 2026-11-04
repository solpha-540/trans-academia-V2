import React, { createContext, useContext, useEffect, useState } from "react";
import { Fonction } from "../types/fonctionType"; // <-- à créer si non existant
import { deleteFonction, getFonctions, updateFonction } from "../components/Api/fonctionService"; // <-- à créer si non existant

type FonctionContextType = {
  fonctions: Fonction[];
  loading: boolean;
  error: string | null;
  refreshFonctions: () => void;
  updateFonctionData: (id: number, payload: { libelle: string }) => Promise<void>;
  deleteFonctionData: (id: number) => Promise<void>;
};

const FonctionContext = createContext<FonctionContextType | undefined>(undefined);

export const FonctionProvider = ({ children }: { children: React.ReactNode }) => {
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFonctions = async () => {
    try {
      setLoading(true);
      const data = await getFonctions(); // appel API
      setFonctions(data);
      setError(null);
    } catch (err: any) {
      setError("Erreur de chargement des fonctions.");
    } finally {
      setLoading(false);
    }
  };

  const updateFonctionData = async (id: number, payload: { libelle: string }) => {
    try {
      setLoading(true);
      await updateFonction(id, payload);
      await fetchFonctions();
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la mise à jour de la fonction.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFonctionData = async (id: number) => {
    try {
      setLoading(true);
      await deleteFonction(id);
      await fetchFonctions();
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la suppression de la fonction.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFonctions();
  }, []);

  return (
    <FonctionContext.Provider
      value={{
        fonctions,
        loading,
        error,
        refreshFonctions: fetchFonctions,
        updateFonctionData,
        deleteFonctionData,
      }}
    >
      {children}
    </FonctionContext.Provider>
  );
};

// Hook personnalisé
export const useFonctionContext = () => {
  const context = useContext(FonctionContext);
  if (!context) {
    throw new Error("useFonctionContext doit être utilisé dans un FonctionProvider");
  }
  return context;
};
