import React, { createContext, useContext, useState } from "react";
import {
  createAffectation,
  reassignAffectation,
  getFonctionsByService,
} from "../components/Api/affectationService";
import {
  AffectationResponse,
  AffectationResponseData,
  FonctionItem,
} from "../types/affectationType";

interface AffectationContextType {
  // Loading states
  loading: boolean;
  loadingFonctions: boolean;
  // Messages
  error: string | null;
  success: string | null;
  // Data
  fonctions: FonctionItem[];
  lastAffectation: AffectationResponseData | null;
  // Actions
  clearMessages: () => void;
  createAffectationAction: (
    agentId: number,
    serviceId: number,
    fonctionId: number,
    gradeId: number
  ) => Promise<AffectationResponse | null>;
  reassignAffectationAction: (
    agentId: number,
    serviceId: number,
    fonctionId: number,
    gradeId: number
  ) => Promise<AffectationResponse | null>;
  loadFonctionsByService: (serviceId: number) => Promise<void>;
  clearFonctions: () => void;
}

const AffectationContext =
  createContext<AffectationContextType | undefined>(undefined);

export const useAffectationContext = (): AffectationContextType => {
  const context = useContext(AffectationContext);
  if (!context) {
    throw new Error(
      "useAffectationContext doit être utilisé dans un AffectationProvider"
    );
  }
  return context;
};

interface AffectationProviderProps {
  children: React.ReactNode;
}

export const AffectationProvider: React.FC<AffectationProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingFonctions, setLoadingFonctions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fonctions, setFonctions] = useState<FonctionItem[]>([]);
  const [lastAffectation, setLastAffectation] = useState<AffectationResponseData | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const clearFonctions = () => {
    setFonctions([]);
  };

  // Load fonctions by service ID
  const loadFonctionsByService = async (serviceId: number): Promise<void> => {
    setLoadingFonctions(true);
    setFonctions([]);

    try {
      const response = await getFonctionsByService(serviceId);

      if (response.success && response.data?.fonctions) {
        setFonctions(response.data.fonctions);
      } else {
        setFonctions([]);
        console.warn("Aucune fonction trouvée pour ce service");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des fonctions :", err);
      setFonctions([]);
    } finally {
      setLoadingFonctions(false);
    }
  };

  const createAffectationAction = async (
    agentId: number,
    serviceId: number,
    fonctionId: number,
    gradeId: number
  ): Promise<AffectationResponse | null> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createAffectation(agentId, serviceId, fonctionId, gradeId);

      if (response.success) {
        setSuccess(response.message);
        if (response.data) {
          setLastAffectation(response.data);
        }
      } else {
        setError(response.message);
      }

      return response;
    } catch (err) {
      console.error("Erreur lors de l'affectation :", err);
      setError("Erreur lors de l'affectation de l'agent");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reassignAffectationAction = async (
    agentId: number,
    serviceId: number,
    fonctionId: number,
    gradeId: number
  ): Promise<AffectationResponse | null> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await reassignAffectation(agentId, serviceId, fonctionId, gradeId);

      if (response.success) {
        setSuccess(response.message);
        if (response.data) {
          setLastAffectation(response.data);
        }
      } else {
        setError(response.message);
      }

      return response;
    } catch (err) {
      console.error("Erreur lors de la réaffectation :", err);
      setError("Erreur lors de la réaffectation de l'agent");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value: AffectationContextType = {
    loading,
    loadingFonctions,
    error,
    success,
    fonctions,
    lastAffectation,
    clearMessages,
    createAffectationAction,
    reassignAffectationAction,
    loadFonctionsByService,
    clearFonctions,
  };

  return (
    <AffectationContext.Provider value={value}>
      {children}
    </AffectationContext.Provider>
  );
};

