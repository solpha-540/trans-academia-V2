import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Cursus, CursusPayload } from '../types/cursusType';
import { getCursus, createCursus, updateCursus } from '../components/Api/cursusService';

// Interface pour le contexte Cursus
interface CursusContextType {
  cursus: Cursus[];
  loadingCursus: boolean;
  errorCursus: string | null;
  addCursus: (cursus: CursusPayload) => Promise<Cursus>;
  updateCursus: (id: number, cursus: CursusPayload) => Promise<Cursus>;
  fetchCursus: () => Promise<void>;
  clearError: () => void;
}

// Créer le contexte
const CursusContext = createContext<CursusContextType | undefined>(undefined);

// Props pour le provider
interface CursusProviderProps {
  children: ReactNode;
}

// Provider du contexte Cursus
export const CursusProvider: React.FC<CursusProviderProps> = ({ children }) => {
  const [cursus, setCursus] = useState<Cursus[]>([]);
  const [loadingCursus, setLoadingCursus] = useState(false);
  const [errorCursus, setErrorCursus] = useState<string | null>(null);

  // Fonction pour récupérer la liste des cursus
  const fetchCursus = async (): Promise<void> => {
    setLoadingCursus(true);
    setErrorCursus(null);
    
    try {
      const cursusData = await getCursus();
      setCursus(cursusData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération des cursus';
      setErrorCursus(errorMessage);
      console.error('Erreur lors de la récupération des cursus:', error);
    } finally {
      setLoadingCursus(false);
    }
  };

  // Fonction pour ajouter un nouveau cursus
  const addCursus = async (cursusData: CursusPayload): Promise<Cursus> => {
    setLoadingCursus(true);
    setErrorCursus(null);
    
    try {
      const newCursus = await createCursus(cursusData);
      
      // Ajouter le nouveau cursus à la liste locale
      setCursus(prev => [...prev, newCursus]);
      
      return newCursus;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du cursus';
      setErrorCursus(errorMessage);
      console.error('Erreur lors de la création du cursus:', error);
      throw error;
    } finally {
      setLoadingCursus(false);
    }
  };

  // Fonction pour mettre à jour un cursus existant
  const updateCursusItem = async (id: number, cursusData: CursusPayload): Promise<Cursus> => {
    setLoadingCursus(true);
    setErrorCursus(null);
    
    try {
      const updatedCursus = await updateCursus(id, cursusData);
      
      // Mettre à jour le cursus dans la liste locale
      setCursus(prev => prev.map(item => 
        item.cursus_academique_id === id || item.id === id ? updatedCursus : item
      ));
      
      return updatedCursus;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du cursus';
      setErrorCursus(errorMessage);
      console.error('Erreur lors de la mise à jour du cursus:', error);
      throw error;
    } finally {
      setLoadingCursus(false);
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = (): void => {
    setErrorCursus(null);
  };

  // Valeur du contexte
  const contextValue: CursusContextType = {
    cursus,
    loadingCursus,
    errorCursus,
    addCursus,
    updateCursus: updateCursusItem,
    fetchCursus,
    clearError
  };

  return (
    <CursusContext.Provider value={contextValue}>
      {children}
    </CursusContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte Cursus
export const useCursusContext = (): CursusContextType => {
  const context = useContext(CursusContext);
  
  if (context === undefined) {
    throw new Error('useCursusContext must be used within a CursusProvider');
  }
  
  return context;
};