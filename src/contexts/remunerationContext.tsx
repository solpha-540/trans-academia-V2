import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Remuneration, RemunerationPayload } from '../types/remunerationType';
import { getRemunerationsByAgent, createRemuneration } from '../components/Api/remunerationService';

// Interface pour le contexte Remuneration
interface RemunerationContextType {
  remunerations: Remuneration[];
  loadingRemuneration: boolean;
  errorRemuneration: string | null;
  addRemuneration: (remuneration: RemunerationPayload) => Promise<Remuneration>;
  fetchRemunerationsByAgent: (agentId: number) => Promise<void>;
  clearError: () => void;
}

// Créer le contexte
const RemunerationContext = createContext<RemunerationContextType | undefined>(undefined);

// Props pour le provider
interface RemunerationProviderProps {
  children: ReactNode;
}

// Provider du contexte Remuneration
export const RemunerationProvider: React.FC<RemunerationProviderProps> = ({ children }) => {
  const [remunerations, setRemunerations] = useState<Remuneration[]>([]);
  const [loadingRemuneration, setLoadingRemuneration] = useState(false);
  const [errorRemuneration, setErrorRemuneration] = useState<string | null>(null);

  // Fonction pour récupérer les rémunérations par agent
  const fetchRemunerationsByAgent = async (agentId: number): Promise<void> => {
    setLoadingRemuneration(true);
    setErrorRemuneration(null);
    
    try {
      const remunerationData = await getRemunerationsByAgent(agentId);
      setRemunerations(remunerationData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération des rémunérations';
      setErrorRemuneration(errorMessage);
      console.error('Erreur lors de la récupération des rémunérations:', error);
    } finally {
      setLoadingRemuneration(false);
    }
  };

  // Fonction pour ajouter une nouvelle rémunération
  const addRemuneration = async (remunerationData: RemunerationPayload): Promise<Remuneration> => {
    setLoadingRemuneration(true);
    setErrorRemuneration(null);
    
    try {
      const newRemuneration = await createRemuneration(remunerationData);
      
      // Ajouter la nouvelle rémunération à la liste existante
      setRemunerations(prevRemunerations => [...prevRemunerations, newRemuneration]);
      
      return newRemuneration;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la rémunération';
      setErrorRemuneration(errorMessage);
      console.error('Erreur lors de la création de la rémunération:', error);
      throw error; // Re-throw pour permettre au composant appelant de gérer l'erreur
    } finally {
      setLoadingRemuneration(false);
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = (): void => {
    setErrorRemuneration(null);
  };

  // Valeur du contexte
  const contextValue: RemunerationContextType = {
    remunerations,
    loadingRemuneration,
    errorRemuneration,
    addRemuneration,
    fetchRemunerationsByAgent,
    clearError
  };

  return (
    <RemunerationContext.Provider value={contextValue}>
      {children}
    </RemunerationContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte Remuneration
export const useRemunerationContext = (): RemunerationContextType => {
  const context = useContext(RemunerationContext);
  
  if (context === undefined) {
    throw new Error('useRemunerationContext doit être utilisé dans un RemunerationProvider');
  }
  
  return context;
};