import React, { createContext, useContext, useEffect, useState } from "react";
import { Signalement } from "../types/signalementType";
import { getSignalements, getSignalementById, getSignalementsByDateRange } from "../components/Api/signalementService";

type SignalementContextType = {
  signalements: Signalement[];
  loading: boolean;
  error: string | null;
  refreshSignalements: () => void;
  fetchSignalementById: (id: number) => Promise<Signalement | null>;
  fetchSignalementsByDateRange: (dateDebut: string, dateFin: string) => Promise<void>;
};

const SignalementContext = createContext<SignalementContextType | undefined>(undefined);

export const SignalementProvider = ({ children }: { children: React.ReactNode }) => {
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Récupérer tous les signalements
  const fetchSignalements = async () => {
    try {
      setLoading(true);
      const data = await getSignalements();
      setSignalements(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setSignalements([]);
      setError("Erreur de chargement des signalements.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Récupérer un signalement par ID
  const fetchSignalementById = async (id: number): Promise<Signalement | null> => {
    try {
      setLoading(true);
      const data = await getSignalementById(id);
      setError(null);
      return data;
    } catch (err: any) {
      setError(`Erreur lors de la récupération du signalement ID ${id}.`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Filtrer les signalements par plage de dates
  const fetchSignalementsByDateRange = async (dateDebut: string, dateFin: string): Promise<void> => {
    try {
      setLoading(true);
      const data = await getSignalementsByDateRange(dateDebut, dateFin);
      setSignalements(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setSignalements([]);
      setError(`Erreur lors de la récupération des signalements entre ${dateDebut} et ${dateFin}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignalements();
  }, []);

  return (
    <SignalementContext.Provider
      value={{ signalements, loading, error, refreshSignalements: fetchSignalements, fetchSignalementById, fetchSignalementsByDateRange }}
    >
      {children}
    </SignalementContext.Provider>
  );
};

// Hook personnalisé
export const useSignalementContext = () => {
  const context = useContext(SignalementContext);
  if (!context) {
    throw new Error("useSignalementContext doit être utilisé dans un SignalementProvider");
  }
  return context;
};
