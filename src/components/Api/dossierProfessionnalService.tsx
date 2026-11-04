import { DossierProfessionnel, DossierProfessionnelPayload, UpdateDossierProfessionnelData } from "../../types/dossierProfessionnalType";
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

// 🔁 Récupération de la liste des dossiers professionnels
export const getDossiersProfessionnels = async (): Promise<DossierProfessionnel[]> => {
  try {
    const response = await api.get("/");
    
    // Vérifier si la réponse est valide
    if (!response.data || !response.data.data) {
      throw new Error('Réponse invalide du serveur');
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des dossiers professionnels :", error);
    return handleBackendError(error);
  }
};

// 📁 Fonction pour sauvegarder les documents du dossier professionnel
export const saveDocumentToAssets = async (file: File, dossierId: string, documentType: string): Promise<string> => {
  try {
    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${documentType}_${dossierId}_${timestamp}.${fileExtension}`;
    const filePath = `src/images/profile/agent/dossiers_professionnels/${fileName}`;

    // Convertir le fichier en base64 pour le stockage
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          // Ici, vous pourriez implémenter la logique de sauvegarde réelle
          // Pour l'instant, on simule la sauvegarde
          console.log(`Sauvegarde du document: ${fileName}`);
          console.log(`Chemin: ${filePath}`);
          console.log(`Taille du fichier: ${file.size} bytes`);
          
          // Retourner le chemin du fichier sauvegardé
          resolve(filePath);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du document:', error);
    throw error;
  }
};

// 📋 Validation des données dossier professionnel
export const validateDossierProfessionnelData = (data: DossierProfessionnelPayload): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.id_op_agent || data.id_op_agent <= 0) errors.id_op_agent = 'L\'ID de l\'agent est requis';
  if (!data.id_user_created?.trim()) errors.id_user_created = 'L\'ID de l\'utilisateur créateur est requis';
  
  // Au moins un document doit être fourni
  const hasAtLeastOneDocument = data.curiculum_vitae || data.diplome_etat || data.diplome_gradua || data.diplome_licence;
  if (!hasAtLeastOneDocument) {
    errors.documents = 'Au moins un document doit être fourni';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ➕ Création d'un nouveau dossier professionnel avec gestion de fichiers
export const createDossierProfessionnel = async (data: DossierProfessionnelPayload): Promise<DossierProfessionnel> => {
    try {
      // Valider les données
      const validation = validateDossierProfessionnelData(data);
      if (!validation.isValid) {
        const validationError = new Error(`Données invalides: ${Object.values(validation.errors).join(', ')}`);
        (validationError as any).code = 'VALIDATION_ERROR';
        (validationError as any).errors = validation.errors;
        throw validationError;
      }
  
      console.log('Envoi des données dossier professionnel:', data);
      
      // Préparer les données FormData pour l'envoi
      const formData = new FormData();
      
      // Ajouter les champs de base
      formData.append('id_op_agent', String(data.id_op_agent));
      formData.append('id_user_created', data.id_user_created);
      
      // Ajouter les fichiers s'ils existent
      if (data.curiculum_vitae) {
        formData.append('curiculum_vitae', data.curiculum_vitae);
      }
      if (data.diplome_etat) {
        formData.append('diplome_etat', data.diplome_etat);
      }
      if (data.diplome_gradua) {
        formData.append('diplome_gradua', data.diplome_gradua);
      }
      if (data.diplome_licence) {
        formData.append('diplome_licence', data.diplome_licence);
      }
      
      const response = await api.post("/agent/createDossier", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Vérifier la réponse du backend
      if (!response.data) {
        throw new Error('Réponse invalide du serveur');
      }
      
      // Vérifier si la création a réussi selon la structure de réponse du backend
      if (response.data.success === false) {
        const backendError = new Error(response.data.message || 'Erreur lors de la création du dossier professionnel');
        (backendError as any).code = response.data.code;
        (backendError as any).backendResponse = response.data;
        throw backendError;
      }
      
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la création du dossier professionnel :", error);
      return handleBackendError(error);
    }
  };

// 🔄 Mise à jour d'un dossier professionnel existant
export const updateDossierProfessionnel = async (
  dossierId: number,
  data: UpdateDossierProfessionnelData
): Promise<DossierProfessionnel> => {
  try {
    console.log('Mise à jour du dossier professionnel ID:', dossierId);
    console.log('Données envoyées (update):', data);

    const formData = new FormData();

    // id_user_created obligatoire côté backend
    formData.append('id_user_created', data.id_user_created);

    // Ajouter uniquement les fichiers fournis (optionnels)
    if (data.curiculum_vitae) {
      formData.append('curiculum_vitae', data.curiculum_vitae);
    }
    if (data.diplome_etat) {
      formData.append('diplome_etat', data.diplome_etat);
    }
    if (data.diplome_gradua) {
      formData.append('diplome_gradua', data.diplome_gradua);
    }
    if (data.diplome_licence) {
      formData.append('diplome_licence', data.diplome_licence);
    }

    const response = await api.post("/agent/updateDossier", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        dossier_id: dossierId,
      },
    });

    if (!response.data) {
      throw new Error('Réponse invalide du serveur');
    }

    if (response.data.success === false) {
      const backendError = new Error(response.data.message || 'Erreur lors de la mise à jour du dossier professionnel');
      (backendError as any).code = response.data.code;
      (backendError as any).backendResponse = response.data;
      throw backendError;
    }

    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du dossier professionnel :', error);
    return handleBackendError(error);
  }
};

// 🔄 Fonction utilitaire pour formater les données dossier professionnel
export const formatDossierProfessionnelData = (formData: any): DossierProfessionnelPayload => {
  return {
    id_op_agent: Number(formData.id_op_agent) || 0,
    id_user_created: formData.id_user_created || '',
    curiculum_vitae: formData.curiculum_vitae || null,
    diplome_etat: formData.diplome_etat || null,
    diplome_gradua: formData.diplome_gradua || null,
    diplome_licence: formData.diplome_licence || null
  };
};