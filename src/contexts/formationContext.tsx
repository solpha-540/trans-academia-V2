import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Formation, FormationPayload, UpdateFormationData } from '../types/formationType';
import { getFormations, createFormation, updateFormation } from '../components/Api/formationService';

// Interface pour le contexte Formation
interface FormationContextType {
  formations: Formation[];
  loadingFormation: boolean;
  errorFormation: string | null;
  addFormation: (formation: FormationPayload) => Promise<Formation>;
  updateFormationData: (formationId: number, data: UpdateFormationData) => Promise<Formation>;
  fetchFormations: () => Promise<void>;
  clearError: () => void;
}

// Créer le contexte
const FormationContext = createContext<FormationContextType | undefined>(undefined);

// Props pour le provider
interface FormationProviderProps {
  children: ReactNode;
}

// Provider du contexte Formation
export const FormationProvider: React.FC<FormationProviderProps> = ({ children }) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loadingFormation, setLoadingFormation] = useState(false);
  const [errorFormation, setErrorFormation] = useState<string | null>(null);

  // Fonction pour récupérer la liste des formations
  const fetchFormations = async (): Promise<void> => {
    setLoadingFormation(true);
    setErrorFormation(null);
    
    try {
      const formationsData = await getFormations();
      setFormations(formationsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération des formations';
      setErrorFormation(errorMessage);
      console.error('Erreur lors de la récupération des formations:', error);
    } finally {
      setLoadingFormation(false);
    }
  };

  // Fonction pour ajouter une nouvelle formation
  const addFormation = async (formationData: FormationPayload): Promise<Formation> => {
    setLoadingFormation(true);
    setErrorFormation(null);
    
    try {
      const newFormation = await createFormation(formationData);
      
      // Ajouter la nouvelle formation à la liste locale
      setFormations(prev => [...prev, newFormation]);
      
      return newFormation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la formation';
      setErrorFormation(errorMessage);
      console.error('Erreur lors de la création de la formation:', error);
      throw error; // Re-throw pour que le composant puisse gérer l'erreur
    } finally {
      setLoadingFormation(false);
    }
  };

  // Fonction pour mettre à jour une formation existante
  const updateFormationData = async (formationId: number, formationData: UpdateFormationData): Promise<Formation> => {
    setLoadingFormation(true);
    setErrorFormation(null);
    
    try {
      const updatedFormation = await updateFormation(formationId, formationData);
      
      // Mettre à jour la formation dans la liste locale
      setFormations(prev => prev.map(formation => 
        formation.id === formationId ? { ...formation, ...updatedFormation } : formation
      ));
      
      return updatedFormation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la formation';
      setErrorFormation(errorMessage);
      console.error('Erreur lors de la mise à jour de la formation:', error);
      throw error; // Re-throw pour que le composant puisse gérer l'erreur
    } finally {
      setLoadingFormation(false);
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = (): void => {
    setErrorFormation(null);
  };

  // Valeur du contexte
  const contextValue: FormationContextType = {
    formations,
    loadingFormation,
    errorFormation,
    addFormation,
    updateFormationData,
    fetchFormations,
    clearError
  };

  return (
    <FormationContext.Provider value={contextValue}>
      {children}
    </FormationContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte Formation
export const useFormationContext = (): FormationContextType => {
  const context = useContext(FormationContext);
  
  if (context === undefined) {
    throw new Error('useFormationContext must be used within a FormationProvider');
  }
  
  return context;
};