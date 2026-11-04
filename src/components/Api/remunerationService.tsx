import { Remuneration, RemunerationPayload, RemunerationResponse } from "../../types/remunerationType";
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

// 🔁 Récupération des rémunérations par agent
export const getRemunerationsByAgent = async (agentId: number): Promise<Remuneration[]> => {
  try {
    const response = await api.get<RemunerationResponse>(`/agent/Remuneration?id=${agentId}`);
    return response.data.data || [];
  } catch (error) {
    // Handle 404 as a valid empty result (no remunerations found)
    if (error instanceof AxiosError && error.response?.status === 404) {
      const responseData = error.response.data;
      // Check if it's the expected "no remunerations found" response
      if (responseData && responseData.code === 404 && responseData.message === 'Aucune rémunération trouvée') {
        console.log('Aucune rémunération trouvée pour l\'agent:', agentId);
        return responseData.data || [];
      }
    }
    
    console.error('Erreur lors de la récupération des rémunérations:', error);
    return handleBackendError(error);
  }
};

// 📋 Validation des données rémunération
export const validateRemunerationData = (data: RemunerationPayload): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validation id_op_agent
  if (!data.id_op_agent || data.id_op_agent <= 0) {
    errors.id_op_agent = 'L\'ID de l\'agent est requis et doit être valide';
  }

  // Validation id_prime
  if (!data.id_prime || data.id_prime <= 0) {
    errors.id_prime = 'L\'ID de la prime est requis et doit être valide';
  }

  // Validation id_user_created
  if (!data.id_user_created || data.id_user_created.trim() === '') {
    errors.id_user_created = 'L\'ID utilisateur créateur est requis';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ➕ Création d'une nouvelle rémunération
export const createRemuneration = async (data: RemunerationPayload): Promise<Remuneration> => {
  try {
    // Validation côté client
    const validation = validateRemunerationData(data);
    if (!validation.isValid) {
      const errorMessage = Object.entries(validation.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(', ');
      throw new Error(`Données invalides - ${errorMessage}`);
    }

    const response = await api.post<Remuneration>('/agent/registerRemuneration', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la rémunération:', error);
    return handleBackendError(error);
  }
};

// 🔄 Fonction utilitaire pour formater les données rémunération
export const formatRemunerationData = (formData: any): RemunerationPayload => {
  return {
    id_op_agent: parseInt(formData.id_op_agent) || 0,
    id_prime: parseInt(formData.id_prime) || 0,
    id_user_created: formData.id_user_created || ''
  };
};

// ==================== MULTIPLE PRIMES SUPPORT ====================

// 🆕 Interface d'un élément prime dans le payload multiple
export interface PrimeItemPayload {
  id_prime: number;
}

// 🆕 Payload pour plusieurs primes
export interface MultiplePrimesPayload {
  id_op_agent: number;
  id_user_created: string;
  primes: PrimeItemPayload[];
}

// 📋 Validation des données pour plusieurs primes
export const validateMultiplePrimesData = (data: MultiplePrimesPayload): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.id_op_agent || data.id_op_agent <= 0) {
    errors.id_op_agent = "L'ID de l'agent est requis et doit être valide";
  }

  if (!data.id_user_created || data.id_user_created.trim() === "") {
    errors.id_user_created = "L'ID utilisateur créateur est requis";
  }

  if (!data.primes || data.primes.length === 0) {
    errors.primes = "Au moins une prime doit être sélectionnée";
  } else {
    // Vérifier que chaque id_prime est valide
    const invalidPrime = data.primes.find(p => !p.id_prime || p.id_prime <= 0);
    if (invalidPrime) {
      errors.primes = "Chaque prime doit avoir un id_prime valide";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ➕ Création de plusieurs rémunérations (plusieurs primes)
export const createMultipleRemunerations = async (data: MultiplePrimesPayload): Promise<Remuneration[]> => {
  try {
    const validation = validateMultiplePrimesData(data);
    if (!validation.isValid) {
      const errorMessage = Object.entries(validation.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(", ");
      throw new Error(`Données invalides - ${errorMessage}`);
    }

    const response = await api.post<Remuneration[]>("/agent/registerRemuneration", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création des rémunérations multiples:", error);
    return handleBackendError(error);
  }
};

// ================== FIN MULTIPLE PRIMES SUPPORT ==================