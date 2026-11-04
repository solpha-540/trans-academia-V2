import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Prime, PrimePayload } from '../types/primeType';
import { getPrimes, createPrime, updatePrime } from '../components/Api/primeService';

// Interface pour le contexte Prime
interface PrimeContextType {
  primes: Prime[];
  loadingPrime: boolean;
  errorPrime: string | null;
  updatePrime: (id: number, primeData: PrimePayload) => Promise<Prime>;
  addPrime: (prime: PrimePayload) => Promise<Prime>;
  fetchPrimes: () => Promise<void>;
  clearError: () => void;
}

// Créer le contexte
const PrimeContext = createContext<PrimeContextType | undefined>(undefined);

// Props pour le provider
interface PrimeProviderProps {
  children: ReactNode;
}

// Provider du contexte Prime
export const PrimeProvider: React.FC<PrimeProviderProps> = ({ children }) => {
  const [primes, setPrimes] = useState<Prime[]>([]);
  const [loadingPrime, setLoadingPrime] = useState(false);
  const [errorPrime, setErrorPrime] = useState<string | null>(null);

  // Fonction pour récupérer la liste des primes
  const fetchPrimes = async (): Promise<void> => {
    setLoadingPrime(true);
    setErrorPrime(null);
    
    try {
      const primeData = await getPrimes();
      setPrimes(primeData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération des primes';
      setErrorPrime(errorMessage);
      console.error('Erreur lors de la récupération des primes:', error);
    } finally {
      setLoadingPrime(false);
    }
  };

  // Fonction pour ajouter une nouvelle prime
  const addPrime = async (primeData: PrimePayload): Promise<Prime> => {
    setLoadingPrime(true);
    setErrorPrime(null);
    
    try {
      const newPrime = await createPrime(primeData);
      
      // Ajouter la nouvelle prime à la liste existante
      setPrimes(prevPrimes => [...prevPrimes, newPrime]);
      
      return newPrime;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la prime';
      setErrorPrime(errorMessage);
      console.error('Erreur lors de la création de la prime:', error);
      throw error; // Re-throw pour permettre au composant de gérer l'erreur
    } finally {
      setLoadingPrime(false);
    }
  };

  // Fonction pour mettre à jour une prime
const updatePrimeInContext = async (id: number, primeData: PrimePayload): Promise<Prime> => {
  setLoadingPrime(true);
  setErrorPrime(null);

  try {
    const updatedPrime = await updatePrime(id, primeData);

    // Mettre à jour la prime dans le state
    setPrimes(prevPrimes =>
      prevPrimes.map(p => (p.id === id ? updatedPrime : p))
    );

    return updatedPrime;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la prime';
    setErrorPrime(errorMessage);
    console.error('Erreur lors de la mise à jour de la prime:', error);
    throw error;
  } finally {
    setLoadingPrime(false);
  }
};


  // Fonction pour effacer les erreurs
  const clearError = (): void => {
    setErrorPrime(null);
  };

  const contextValue: PrimeContextType = {
    primes,
    loadingPrime,
    errorPrime,
    addPrime,
    fetchPrimes,
    updatePrime: updatePrimeInContext, // <-- ajout
    clearError
  };
  

  return (
    <PrimeContext.Provider value={contextValue}>
      {children}
    </PrimeContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte Prime
export const usePrimeContext = (): PrimeContextType => {
  const context = useContext(PrimeContext);
  
  if (context === undefined) {
    throw new Error('usePrimeContext must be used within a PrimeProvider');
  }
  
  return context;
};