import React, { createContext, useContext, useState, useCallback } from "react";
import { SignalementBySession, Session } from "../types/signalementBySessionType";
import {
  getSessions,
  getSignalementBySessionById,
  getSignalementsBySessionWithDateFilter,
} from "../components/Api/signalementBySessionService";

type SignalementBySessionContextType = {
  signalementsBySession: SignalementBySession[];
  sessions: Session[];
  selectedSession: Session | null;
  loading: boolean;
  loadingSessions: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  fetchSignalementBySession: (idSession: number, dateDebut?: string, dateFin?: string) => Promise<void>;
  fetchSignalementById: (id: number) => Promise<SignalementBySession | null>;
  setSelectedSession: (session: Session | null) => void;
  clearSignalements: () => void;
  refreshData: () => Promise<void>;
};

const SignalementBySessionContext = createContext<SignalementBySessionContextType | undefined>(undefined);

export const SignalementBySessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [signalementsBySession, setSignalementsBySession] = useState<SignalementBySession[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSessions, setLoadingSessions] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la liste des sessions
  const fetchSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      setError(null);
      const data = await getSessions();
      setSessions(data);
    } catch (err: any) {
      setError("Erreur lors du chargement des sessions.");
      console.error("Erreur fetchSessions:", err);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  // Récupérer les signalements par session avec filtres optionnels
  const fetchSignalementBySession = useCallback(async (
    idSession: number,
    dateDebut?: string,
    dateFin?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSignalementsBySessionWithDateFilter(idSession, dateDebut, dateFin);
      setSignalementsBySession(data);
    } catch (err: any) {
      setError(`Erreur lors du chargement des signalements pour la session ${idSession}.`);
      console.error("Erreur fetchSignalementBySession:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer un signalement par ID
  const fetchSignalementById = useCallback(async (id: number): Promise<SignalementBySession | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSignalementBySessionById(id);
      return data;
    } catch (err: any) {
      setError(`Erreur lors de la récupération du signalement ID ${id}.`);
      console.error("Erreur fetchSignalementById:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Effacer les signalements
  const clearSignalements = useCallback(() => {
    setSignalementsBySession([]);
    setError(null);
  }, []);

  // Rafraîchir les données avec la session sélectionnée
  const refreshData = useCallback(async () => {
    if (selectedSession) {
      await fetchSignalementBySession(selectedSession.id);
    }
  }, [selectedSession, fetchSignalementBySession]);

  return (
    <SignalementBySessionContext.Provider
      value={{
        signalementsBySession,
        sessions,
        selectedSession,
        loading,
        loadingSessions,
        error,
        fetchSessions,
        fetchSignalementBySession,
        fetchSignalementById,
        setSelectedSession,
        clearSignalements,
        refreshData,
      }}
    >
      {children}
    </SignalementBySessionContext.Provider>
  );
};

// Hook personnalisé
export const useSignalementBySessionContext = () => {
  const context = useContext(SignalementBySessionContext);
  if (!context) {
    throw new Error("useSignalementBySessionContext doit être utilisé dans un SignalementBySessionProvider");
  }
  return context;
};
