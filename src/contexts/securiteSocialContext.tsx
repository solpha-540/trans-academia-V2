import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  SecuriteSociale,
  SecuriteSocialePayload,
  UpdateSecuriteSocialeData,
} from '../types/securiteSocialType';
import {
  getSecuritesSociales,
  createSecuriteSociale,
  updateSecuriteSociale as updateSecuriteSocialeService
} from '../components/Api/securiteSocialService';

// Interface du contexte
interface SecuriteSocialeContextType {
  securitesSociales: SecuriteSociale[];
  loadingSecuriteSociale: boolean;
  errorSecuriteSociale: string | null;
  addSecuriteSociale: (securiteSociale: SecuriteSocialePayload) => Promise<SecuriteSociale>;
  updateSecuriteSociale: (id: number, data: UpdateSecuriteSocialeData) => Promise<SecuriteSociale>;
  fetchSecuritesSociales: () => Promise<void>;
  clearError: () => void;
}

// Créer le contexte
const SecuriteSocialeContext = createContext<SecuriteSocialeContextType | undefined>(undefined);

// Props du provider
interface SecuriteSocialeProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const SecuriteSocialeProvider: React.FC<SecuriteSocialeProviderProps> = ({ children }) => {
  const [securitesSociales, setSecuritesSociales] = useState<SecuriteSociale[]>([]);
  const [loadingSecuriteSociale, setLoadingSecuriteSociale] = useState(false);
  const [errorSecuriteSociale, setErrorSecuriteSociale] = useState<string | null>(null);

  // Récupération des sécurités sociales
  const fetchSecuritesSociales = async (): Promise<void> => {
    setLoadingSecuriteSociale(true);
    setErrorSecuriteSociale(null);

    try {
      const data = await getSecuritesSociales();
      setSecuritesSociales(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la récupération des sécurités sociales';
      setErrorSecuriteSociale(message);
      console.error('Erreur fetchSecuritesSociales:', error);
    } finally {
      setLoadingSecuriteSociale(false);
    }
  };

  // Création d'une sécurité sociale
  const addSecuriteSociale = async (
    securiteSocialeData: SecuriteSocialePayload
  ): Promise<SecuriteSociale> => {
    setLoadingSecuriteSociale(true);
    setErrorSecuriteSociale(null);

    try {
      const newItem = await createSecuriteSociale(securiteSocialeData);
      setSecuritesSociales((prev) => [...prev, newItem]);
      return newItem;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la création de la sécurité sociale';
      setErrorSecuriteSociale(message);
      console.error('Erreur addSecuriteSociale:', error);
      throw error;
    } finally {
      setLoadingSecuriteSociale(false);
    }
  };

  // Mise à jour d'une sécurité sociale
  const updateSecuriteSociale = async (
    id: number,
    data: UpdateSecuriteSocialeData
  ): Promise<SecuriteSociale> => {
    setLoadingSecuriteSociale(true);
    setErrorSecuriteSociale(null);

    try {
      const updatedItem = await updateSecuriteSocialeService(id, data);
      setSecuritesSociales((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la sécurité sociale';
      setErrorSecuriteSociale(message);
      console.error('Erreur updateSecuriteSociale:', error);
      throw error;
    } finally {
      setLoadingSecuriteSociale(false);
    }
  };

  // Nettoyer les erreurs
  const clearError = (): void => {
    setErrorSecuriteSociale(null);
  };

  const contextValue: SecuriteSocialeContextType = {
    securitesSociales,
    loadingSecuriteSociale,
    errorSecuriteSociale,
    addSecuriteSociale,
    updateSecuriteSociale,
    fetchSecuritesSociales,
    clearError,
  };

  return (
    <SecuriteSocialeContext.Provider value={contextValue}>
      {children}
    </SecuriteSocialeContext.Provider>
  );
};

// Hook personnalisé
export const useSecuriteSocialeContext = (): SecuriteSocialeContextType => {
  const context = useContext(SecuriteSocialeContext);

  if (context === undefined) {
    throw new Error('useSecuriteSocialeContext must be used within a SecuriteSocialeProvider');
  }

  return context;
};
