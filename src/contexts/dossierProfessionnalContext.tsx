import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DossierProfessionnel, DossierProfessionnelPayload, UpdateDossierProfessionnelData } from '../types/dossierProfessionnalType';
import { getDossiersProfessionnels, createDossierProfessionnel, updateDossierProfessionnel } from '../components/Api/dossierProfessionnalService';

// Interface pour le contexte DossierProfessionnel
interface DossierProfessionnelContextType {
  dossiersProfessionnels: DossierProfessionnel[];
  loadingDossierProfessionnel: boolean;
  errorDossierProfessionnel: string | null;
  addDossierProfessionnel: (dossier: DossierProfessionnelPayload) => Promise<DossierProfessionnel>;
  updateDossierProfessionnelData: (dossierId: number, data: UpdateDossierProfessionnelData) => Promise<DossierProfessionnel>;
  fetchDossiersProfessionnels: () => Promise<void>;
  clearError: () => void;
}

// Créer le contexte
const DossierProfessionnelContext = createContext<DossierProfessionnelContextType | undefined>(undefined);

// Props pour le provider
interface DossierProfessionnelProviderProps {
  children: ReactNode;
}

// Provider du contexte DossierProfessionnel
export const DossierProfessionnelProvider: React.FC<DossierProfessionnelProviderProps> = ({ children }) => {
  const [dossiersProfessionnels, setDossiersProfessionnels] = useState<DossierProfessionnel[]>([]);
  const [loadingDossierProfessionnel, setLoadingDossierProfessionnel] = useState(false);
  const [errorDossierProfessionnel, setErrorDossierProfessionnel] = useState<string | null>(null);

  // Fonction pour récupérer la liste des dossiers professionnels
  const fetchDossiersProfessionnels = async (): Promise<void> => {
    setLoadingDossierProfessionnel(true);
    setErrorDossierProfessionnel(null);
    
    try {
      const dossiersData = await getDossiersProfessionnels();
      setDossiersProfessionnels(dossiersData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération des dossiers professionnels';
      setErrorDossierProfessionnel(errorMessage);
      console.error('Erreur lors de la récupération des dossiers professionnels:', error);
    } finally {
      setLoadingDossierProfessionnel(false);
    }
  };

  // Fonction pour mettre à jour un dossier professionnel existant
  const updateDossierProfessionnelData = async (
    dossierId: number,
    data: UpdateDossierProfessionnelData
  ): Promise<DossierProfessionnel> => {
    setLoadingDossierProfessionnel(true);
    setErrorDossierProfessionnel(null);

    try {
      const updatedDossier = await updateDossierProfessionnel(dossierId, data);

      // Mettre à jour la liste locale
      setDossiersProfessionnels(prev =>
        prev.map(d => (d.id === dossierId ? updatedDossier : d))
      );

      return updatedDossier;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du dossier professionnel';
      setErrorDossierProfessionnel(errorMessage);
      console.error('Erreur lors de la mise à jour du dossier professionnel:', error);
      throw error;
    } finally {
      setLoadingDossierProfessionnel(false);
    }
  };

  // Fonction pour ajouter un nouveau dossier professionnel
  const addDossierProfessionnel = async (dossierData: DossierProfessionnelPayload): Promise<DossierProfessionnel> => {
    setLoadingDossierProfessionnel(true);
    setErrorDossierProfessionnel(null);
    
    try {
      const newDossier = await createDossierProfessionnel(dossierData);
      
      // Ajouter le nouveau dossier à la liste locale
      setDossiersProfessionnels(prev => [...prev, newDossier]);
      
      return newDossier;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du dossier professionnel';
      setErrorDossierProfessionnel(errorMessage);
      console.error('Erreur lors de la création du dossier professionnel:', error);
      throw error;
    } finally {
      setLoadingDossierProfessionnel(false);
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = (): void => {
    setErrorDossierProfessionnel(null);
  };

  // Valeur du contexte
  const contextValue: DossierProfessionnelContextType = {
    dossiersProfessionnels,
    loadingDossierProfessionnel,
    errorDossierProfessionnel,
    addDossierProfessionnel,
    updateDossierProfessionnelData,
    fetchDossiersProfessionnels,
    clearError,
  };

  return (
    <DossierProfessionnelContext.Provider value={contextValue}>
      {children}
    </DossierProfessionnelContext.Provider>
  );
};

// Hook pour utiliser le contexte DossierProfessionnel
export const useDossierProfessionnelContext = (): DossierProfessionnelContextType => {
  const context = useContext(DossierProfessionnelContext);
  if (!context) {
    throw new Error('useDossierProfessionnelContext must be used within a DossierProfessionnelProvider');
  }
  return context;
};