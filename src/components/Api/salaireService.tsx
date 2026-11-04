import { Salaire, SalairePayload, SalaireUpdatePayload } from "../../types/salaireType";
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

// 🔁 Récupération de la liste des salaires
export const getSalaires = async (): Promise<Salaire[]> => {
  try {
    const response = await api.get('/agent/Salaire');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des salaires:', error);
    return handleBackendError(error);
  }
};

// 📋 Validation des données salaire
export const validateSalaireData = (data: SalairePayload): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.numero_compte?.trim()) {
    errors.numero_compte = 'Le numéro de compte est requis';
  }

  if (!data.nom_banque?.trim()) {
    errors.nom_banque = 'Le nom de la banque est requis';
  }

  if (!data.id_op_agent || data.id_op_agent <= 0) {
    errors.id_op_agent = "L'agent est invalide";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ➕ Création d'un nouveau salaire
export const createSalaire = async (data: SalairePayload): Promise<Salaire> => {
  try {
    // Validation côté client
    const validation = validateSalaireData(data);
    if (!validation.isValid) {
      const validationError = new Error('Données invalides');
      (validationError as any).validationErrors = validation.errors;
      throw validationError;
    }

    console.log('Envoi des données salaire:', data);
    
    const response = await api.post('/agent/registerSalaire', data);
    
    console.log('Réponse de l\'API salaire:', response.data);
    
    // Retourner les données du salaire créé
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la création du salaire:', error);
    return handleBackendError(error);
  }
};

// ✏️ Mise à jour du numéro de compte d'un salaire
export const updateSalaire = async (salaireId: number, data: SalaireUpdatePayload): Promise<Salaire> => {
  try {
    // Validation côté client
    const validation = validateSalaireUpdateData(data);
    if (!validation.isValid) {
      const validationError = new Error('Données de mise à jour invalides');
      (validationError as any).validationErrors = validation.errors;
      throw validationError;
    }

    console.log(`Mise à jour du salaire ${salaireId}:`, data);
    
    const response = await api.put(`/agent/UpdateSalaire?salaire_id=${salaireId}`, data);
    
    console.log('Réponse de mise à jour:', response.data);
    
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du salaire ${salaireId}:`, error);
    return handleBackendError(error);
  }
};

// 📋 Validation des données de mise à jour salaire
export const validateSalaireUpdateData = (data: SalaireUpdatePayload): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.numero_compte?.trim()) {
    errors.numero_compte = 'Le numéro de compte est requis';
  }

  if (!data.nom_banque?.trim()) {
    errors.nom_banque = 'Le nom de la banque est requis';
  }

  if (!data.id_op_agent || data.id_op_agent <= 0) {
    errors.id_op_agent = "L'agent est invalide";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 🔄 Fonction utilitaire pour formater les données salaire
export const formatSalaireData = (formData: any): SalairePayload => {
  return {
    numero_compte: formData.numero_compte?.toString().trim() || '',
    nom_banque: formData.nom_banque?.toString().trim() || '',
    id_op_agent: parseInt(formData.id_op_agent) || 0,
    id_user_created: formData.id_user_created?.toString().trim() || ''
  };
};

export const formatSalaireUpdateData = (formData: any): SalaireUpdatePayload => {
  return {
    numero_compte: formData.numero_compte?.toString().trim() || '',
    nom_banque: formData.nom_banque?.toString().trim() || '',
    id_op_agent: parseInt(formData.id_op_agent) || 0
  };
};