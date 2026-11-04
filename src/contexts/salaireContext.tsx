import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Salaire, SalairePayload, SalaireUpdatePayload } from '../types/salaireType';
import { getSalaires, createSalaire, updateSalaire } from '../components/Api/salaireService';

// Interface pour le contexte Salaire
interface SalaireContextType {
  salaires: Salaire[];
  loadingSalaire: boolean;
  errorSalaire: string | null;
  addSalaire: (salaire: SalairePayload) => Promise<Salaire>;
  updateSalaire: (salaireId: number, salaireData: SalaireUpdatePayload) => Promise<Salaire>;
  fetchSalaires: () => Promise<void>;
  clearError: () => void;
}

// Créer le contexte
const SalaireContext = createContext<SalaireContextType | undefined>(undefined);

// Props pour le provider
interface SalaireProviderProps {
  children: ReactNode;
}

// Provider du contexte Salaire
export const SalaireProvider: React.FC<SalaireProviderProps> = ({ children }) => {
  const [salaires, setSalaires] = useState<Salaire[]>([]);
  const [loadingSalaire, setLoadingSalaire] = useState(false);
  const [errorSalaire, setErrorSalaire] = useState<string | null>(null);

  // Fonction pour récupérer la liste des salaires
  const fetchSalaires = async (): Promise<void> => {
    setLoadingSalaire(true);
    setErrorSalaire(null);
    
    try {
      const salaireData = await getSalaires();
      setSalaires(salaireData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération des salaires';
      setErrorSalaire(errorMessage);
      console.error('Erreur lors de la récupération des salaires:', error);
    } finally {
      setLoadingSalaire(false);
    }
  };

  // Fonction pour ajouter un nouveau salaire
  const addSalaire = async (salaireData: SalairePayload): Promise<Salaire> => {
    setLoadingSalaire(true);
    setErrorSalaire(null);
    
    try {
      const newSalaire = await createSalaire(salaireData);
      
      // Ajouter le nouveau salaire à la liste existante
      setSalaires(prevSalaires => [...prevSalaires, newSalaire]);
      
      return newSalaire;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du salaire';
      setErrorSalaire(errorMessage);
      console.error('Erreur lors de la création du salaire:', error);
      throw error;
    } finally {
      setLoadingSalaire(false);
    }
  };

  // Fonction pour mettre à jour un salaire existant
  const updateSalaireContext = async (salaireId: number, salaireData: SalaireUpdatePayload): Promise<Salaire> => {
    setLoadingSalaire(true);
    setErrorSalaire(null);
    
    try {
      const updatedSalaire = await updateSalaire(salaireId, salaireData);
      
      // Mettre à jour la liste des salaires avec le salaire modifié
      setSalaires(prevSalaires => 
        prevSalaires.map(salaire => 
          salaire.id_salaire === salaireId ? updatedSalaire : salaire
        )
      );
      
      return updatedSalaire;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du salaire';
      setErrorSalaire(errorMessage);
      console.error('Erreur lors de la mise à jour du salaire:', error);
      throw error;
    } finally {
      setLoadingSalaire(false);
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = (): void => {
    setErrorSalaire(null);
  };

  // Valeur du contexte
  const contextValue: SalaireContextType = {
    salaires,
    loadingSalaire,
    errorSalaire,
    addSalaire,
    updateSalaire: updateSalaireContext,
    fetchSalaires,
    clearError
  };

  return (
    <SalaireContext.Provider value={contextValue}>
      {children}
    </SalaireContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte Salaire
export const useSalaireContext = (): SalaireContextType => {
  const context = useContext(SalaireContext);
  
  if (context === undefined) {
    throw new Error('useSalaireContext must be used within a SalaireProvider');
  }
  
  return context;
};