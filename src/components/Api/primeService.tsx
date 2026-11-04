import { Prime, PrimePayload } from "../../types/primeType";
import api from "./axiosConfig";
import { AxiosError } from 'axios';

// Interface pour les réponses d'erreur du backend
interface BackendErrorResponse {
  success: boolean;
  message: string;
  code?: string | number;
  errors?: Record<string, string[]>;
}

// Fonction utilitaire pour gérer les erreurs backend
const handleBackendError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const backendError = error.response?.data as BackendErrorResponse;
    
    if (backendError) {
      // Construire un message d'erreur détaillé
      let errorMessage = backendError.message || 'Une erreur est survenue';
      
      // Ajouter les détails des erreurs de validation si disponibles
      if (backendError.errors) {
        const validationErrors = Object.entries(backendError.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('; ');
        errorMessage += ` - Détails: ${validationErrors}`;
      }
      
      // Ajouter le code d'erreur si disponible
      if (backendError.code) {
        errorMessage += ` (Code: ${backendError.code})`;
      }
      
      const customError = new Error(errorMessage);
      (customError as any).status = error.response?.status;
      (customError as any).code = backendError.code;
      (customError as any).backendResponse = backendError;
      throw customError;
    }
    
    // Erreur HTTP sans réponse backend structurée
    const httpError = new Error(`Erreur HTTP ${error.response?.status}: ${error.response?.statusText || 'Erreur inconnue'}`);
    (httpError as any).status = error.response?.status;
    throw httpError;
  }
  
  // Erreur réseau ou autre
  if (error instanceof Error) {
    throw error;
  }
  
  // Erreur inconnue
  throw new Error('Une erreur inconnue est survenue');
};

// 🔁 Récupération de la liste des primes
export const getPrimes = async (): Promise<Prime[]> => {
  try {
    const response = await api.get('/prime/ListePrimes');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des primes:', error);
    return handleBackendError(error);
  }
};

// 📋 Validation des données prime
export const validatePrimeData = (data: PrimePayload): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.libele?.trim()) {
    errors.libele = 'Le libellé est requis';
  }

  if (!data.montant || data.montant <= 0) {
    errors.montant = 'Le montant doit être supérieur à 0';
  }

  if (!data.type_prime?.trim()) {
    errors.type_prime = 'Le type de prime est requis';
  }

  const idUser = (data.id_user_created !== undefined && data.id_user_created !== null)
    ? data.id_user_created.toString().trim()
    : '';
  if (!idUser) {
    errors.id_user_created = 'L\'ID de l\'utilisateur créateur est requis';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ➕ Création d'une nouvelle prime
export const createPrime = async (data: PrimePayload): Promise<Prime> => {
  try {
    // Validation côté client
    const validation = validatePrimeData(data);
    if (!validation.isValid) {
      const validationError = new Error('Données invalides');
      (validationError as any).validationErrors = validation.errors;
      throw validationError;
    }

    console.log('Envoi des données prime:', data);
    
    const response = await api.post('/prime/registerPrime', data);
    
    console.log('Réponse de l\'API prime:', response.data);
    
    // Retourner les données de la prime créée
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la prime:', error);
    return handleBackendError(error);
  }
};

// components/Api/primeService.ts

// Fonction pour mettre à jour une prime
export const updatePrime = async (primeId: number, primeData: PrimePayload) => {
  try {
    // Validation des données
    const validation = validatePrimeData(primeData);
    if (!validation.isValid) {
      throw new Error('Données de prime invalides');
    }

    // 📌 Nouveau endpoint : PUT prime/UpdatePrime?id=<id>
    const response = await api.put('/prime/UpdatePrime', primeData, { params: { prime_id: primeId } });
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la prime:', error);
    
    // Gestion des erreurs spécifiques
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Erreur lors de la mise à jour de la prime');
    }
  }
};


// 🔄 Fonction utilitaire pour formater les données prime
export const formatPrimeData = (formData: any): PrimePayload => {
  return {
    libele: formData.libele?.toString().trim() || '',
    montant: parseFloat(formData.montant) || 0,
    type_prime: formData.type_prime?.toString().trim() || '',
    id_user_created: formData.id_user_created?.toString().trim() || ''
  };
};