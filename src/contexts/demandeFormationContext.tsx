// contexts/demandeFormationContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DemandeFormation, DemandeFormationResponse } from '../types/demandeFormationType';
import { 
  getDemandesFormation, 
  getDemandeFormationById,
  getDemandesFormationByAgent,
  updateStatut,
  updateFormation
} from '../components/Api/demandeFormationService';

interface DemandeFormationContextType {
  demandes: DemandeFormation[];
  loading: boolean;
  error: string | null;
  refreshDemandes: () => Promise<void>;
  getDemandeById: (id: number) => Promise<DemandeFormation | null>;
  getDemandesByAgent: (agentId: number) => Promise<DemandeFormation[]>;
  updateStatut: (ids: number[], newStatus: string) => Promise<{ success: boolean; message: string }>;
  updateFormation: (id: number, formationData: Partial<DemandeFormation>) => Promise<DemandeFormationResponse>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
}

const DemandeFormationContext = createContext<DemandeFormationContextType | undefined>(undefined);

export const useDemandeFormationContext = () => {
  const context = useContext(DemandeFormationContext);
  if (!context) {
    throw new Error('useDemandeFormationContext must be used within a DemandeFormationProvider');
  }
  return context;
};

interface DemandeFormationProviderProps {
  children: ReactNode;
}

export const DemandeFormationProvider: React.FC<DemandeFormationProviderProps> = ({ children }) => {
  const [demandes, setDemandes] = useState<DemandeFormation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchDemandes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDemandesFormation();
      setDemandes(data);
    } catch (err) {
      setError('Erreur lors du chargement des demandes de formation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  const refreshDemandes = async () => {
    await fetchDemandes();
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getDemandeById = async (id: number): Promise<DemandeFormation | null> => {
    return await getDemandeFormationById(id);
  };

  const getDemandesByAgent = async (agentId: number): Promise<DemandeFormation[]> => {
    return await getDemandesFormationByAgent(agentId);
  };

  return (
    <DemandeFormationContext.Provider
      value={{
        demandes,
        loading,
        error,
        refreshDemandes,
        getDemandeById,
        getDemandesByAgent,
        updateStatut,
        updateFormation,
        searchTerm,
        setSearchTerm,
        clearSearch
      }}
    >
      {children}
    </DemandeFormationContext.Provider>
  );
};