import { Option, OptionPayload, SubCategory, SubSubCategory } from "../../types/optionType";
import { Category } from "../../types/categoryType";
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

// 🔁 Récupération de la liste des catégories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/categorie/get');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return handleBackendError(error);
  }
};

// 🔁 Récupération des sous-catégories par ID de catégorie
export const getSubCategoriesByCategory = async (id_categorie: number): Promise<SubCategory[]> => {
  try {
    const response = await api.get(`/categorie/souscat_by_id?id_categorie=${id_categorie}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-catégories:', error);
    return handleBackendError(error);
  }
};

// 🔁 Récupération des sous-sous-catégories par ID de sous-catégorie
export const getSubSubCategoriesBySubCategory = async (id_sous_cat: number): Promise<SubSubCategory[]> => {
  try {
    const response = await api.get(`/categorie/sub_souscat_by_id?id_sous_cat=${id_sous_cat}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-sous-catégories:', error);
    return handleBackendError(error);
  }
};



// 🔁 Récupération des options par catégorie avec structure hiérarchique
export const getOptionsByCategory = async (id_categorie: number): Promise<any> => {
  try {
    const response = await api.get(`/option?id_categorie=${id_categorie}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des options par catégorie:', error);
    return handleBackendError(error);
  }
};

// 🔍 Validation des données option
export const validateOptionData = (data: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validation du libellé
  if (!data.libelle || data.libelle.toString().trim().length === 0) {
    errors.libelle = 'Le libellé est requis';
  } else if (data.libelle.toString().trim().length < 2) {
    errors.libelle = 'Le libellé doit contenir au moins 2 caractères';
  }

  // Validation de la sous-catégorie
  if (!data.id_sous_cat || parseInt(data.id_sous_cat) <= 0) {
    errors.id_sous_cat = 'La sous-catégorie est requise';
  }

  // Validation de la valeur
  if (data.valeur === undefined || data.valeur === null || data.valeur === '') {
    errors.valeur = 'La valeur est requise';
  } else if (isNaN(parseFloat(data.valeur)) || parseFloat(data.valeur) < 0) {
    errors.valeur = 'La valeur doit être un nombre positif';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ➕ Création d'une nouvelle option
export const createOption = async (data: OptionPayload): Promise<Option> => {
  try {
    // Validation côté client
    const validation = validateOptionData(data);
    if (!validation.isValid) {
      const validationError = new Error('Données invalides');
      (validationError as any).validationErrors = validation.errors;
      throw validationError;
    }

    console.log('Envoi des données option:', data);
    
    const response = await api.post('/option/create', data);
    
    console.log('Réponse de l\'API option:', response.data);
    
    // Retourner les données de l'option créée
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'option:', error);
    return handleBackendError(error);
  }
};

// 🔄 Fonction utilitaire pour formater les données option
export const formatOptionData = (formData: any): OptionPayload => {
  return {
    libelle: formData.libelle?.toString().trim() || '',
    id_sous_cat: parseInt(formData.id_sous_cat) || 0,
    id_sub_sous_cat: formData.id_sub_sous_cat ? parseInt(formData.id_sub_sous_cat) : 500,
    valeur: parseFloat(formData.valeur) || 0
  };
};