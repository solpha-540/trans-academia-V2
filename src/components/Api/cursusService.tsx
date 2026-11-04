import { Cursus, CursusPayload } from "../../types/cursusType";
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
  
  throw new Error('Une erreur inconnue est survenue');
};

// 🔁 Récupération de la liste des cursus
export const getCursus = async (): Promise<Cursus[]> => {
  try {
    const response = await api.get("/agent/ListeCursus");
    
    // Vérifier si la réponse est valide
    if (!response.data || !response.data.data) {
      throw new Error('Réponse invalide du serveur');
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des cursus :", error);
    return handleBackendError(error);
  }
};

// 📋 Validation des données cursus
export const validateCursusData = (data: CursusPayload): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.niveau_etude?.trim()) errors.niveau_etude = 'Le niveau d\'étude est requis';
  if (!data.filiere?.trim()) errors.filiere = 'La filière est requise';
  if (!data.etablissement?.trim()) errors.etablissement = 'L\'établissement est requis';
  if (!data.annee_terminale?.trim()) errors.annee_terminale = 'L\'année terminale est requise'; // AJOUTÉ

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ➕ Création d'un nouveau cursus
export const createCursus = async (data: CursusPayload): Promise<Cursus> => {
  try {
    // Valider les données
    const validation = validateCursusData(data);
    if (!validation.isValid) {
      const validationError = new Error(`Données invalides: ${Object.values(validation.errors).join(', ')}`);
      (validationError as any).code = 'VALIDATION_ERROR';
      (validationError as any).errors = validation.errors;
      throw validationError;
    }

    console.log('Envoi des données cursus:', data);
    
    const response = await api.post("/agent/registerCursus", data);
    
    // Vérifier la réponse du backend
    if (!response.data) {
      throw new Error('Réponse invalide du serveur');
    }
    
    // Vérifier si la création a réussi selon la structure de réponse du backend
    if (response.data.success === false) {
      const backendError = new Error(response.data.message || 'Erreur lors de la création du cursus');
      (backendError as any).code = response.data.code;
      (backendError as any).backendResponse = response.data;
      throw backendError;
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création du cursus :", error);
    return handleBackendError(error);
  }
};

export const updateCursus = async (cursus_academique_id: number, data: CursusPayload): Promise<Cursus> => {
  try {
    // Valider les données
    const validation = validateCursusData(data);
    if (!validation.isValid) {
      const validationError = new Error(`Données invalides: ${Object.values(validation.errors).join(', ')}`);
      (validationError as any).code = 'VALIDATION_ERROR';
      (validationError as any).errors = validation.errors;
      throw validationError;
    }

    console.log('Mise à jour du cursus ID:', cursus_academique_id, 'Données:', data);
    
    const response = await api.post(`/agent/UpdateCursus?cursus_academique_id=${cursus_academique_id}`, data);
    
    // Vérifier la réponse du backend
    if (!response.data) {
      throw new Error('Réponse invalide du serveur');
    }
    
    // Vérifier si la mise à jour a réussi selon la structure de réponse du backend
    if (response.data.success === false) {
      const backendError = new Error(response.data.message || 'Erreur lors de la mise à jour du cursus');
      (backendError as any).code = response.data.code;
      (backendError as any).backendResponse = response.data;
      throw backendError;
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cursus :", error);
    return handleBackendError(error);
  }
};

// 🔄 Fonction utilitaire pour formater les données cursus
export const formatCursusData = (formData: any): CursusPayload => {
  return {
    niveau_etude: formData.niveau_etude?.trim() || '',
    filiere: formData.filiere?.trim() || '',
    etablissement: formData.etablissement?.trim() || '',
    annee_terminale: formData.annee_terminale?.trim() || '', // AJOUTÉ
    id_op_agent: Number(formData.id_op_agent) || 0,
    id_user_created: formData.id_user_created || ''
  };
};