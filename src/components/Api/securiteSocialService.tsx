import { SecuriteSociale, SecuriteSocialePayload } from "../../types/securiteSocialType";
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

// 🔁 Récupération de la liste des sécurités sociales
export const getSecuritesSociales = async (): Promise<SecuriteSociale[]> => {
  try {
    const response = await api.get('/agent/SecuriteSocial');
    return response.data.data || response.data;
  console.log(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des sécurités sociales:', error);
    return handleBackendError(error);
  }
};

// 📋 Validation des données sécurité sociale
export const validateSecuriteSocialeData = (data: SecuriteSocialePayload): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.numero?.trim()) {
    errors.numero = 'Le numéro de sécurité sociale est requis';
  }

  if (!data.id_op_agent || data.id_op_agent <= 0) {
    errors.id_op_agent = 'L\'ID de l\'agent est requis';
  }

  if (!data.id_user_created?.trim()) {
    errors.id_user_created = 'L\'ID de l\'utilisateur créateur est requis';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ➕ Création d'une nouvelle sécurité sociale
export const createSecuriteSociale = async (data: SecuriteSocialePayload): Promise<SecuriteSociale> => {
  try {
    // Validation côté client
    const validation = validateSecuriteSocialeData(data);
    if (!validation.isValid) {
      const validationError = new Error('Données invalides');
      (validationError as any).validationErrors = validation.errors;
      throw validationError;
    }

    console.log('Envoi des données sécurité sociale:', data);
    
    const response = await api.post('/agent/registerSecuriteSocial', data);
    
    console.log('Réponse de l\'API sécurité sociale:', response.data);
    
    // Retourner les données de la sécurité sociale créée
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la sécurité sociale:', error);
    return handleBackendError(error);
  }
};

// 🔄 Fonction utilitaire pour formater les données sécurité sociale
export const formatSecuriteSocialeData = (formData: any): SecuriteSocialePayload => {
  return {
    numero: formData.numero?.toString().trim() || '',
    id_op_agent: parseInt(formData.id_op_agent) || 0,
    id_user_created: formData.id_user_created?.toString().trim() || ''
  };
};

export const updateSecuriteSociale = async (id: number, data: Partial<SecuriteSocialePayload>): Promise<SecuriteSociale> => {
  try {
    const response = await api.put(`/agent/UpdateSecuriteSocial?securite_social_id=${id}`, data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la sécurité sociale:', error);
    return handleBackendError(error);
  }
};