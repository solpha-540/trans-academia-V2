import { Formation, FormationPayload, UpdateFormationData } from "../../types/formationType";
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

// 🔁 Récupération de la liste des formations
export const getFormations = async (): Promise<Formation[]> => {
  try {
    const response = await api.get("/agent/ListeFormations");
    
    // Vérifier si la réponse est valide
    if (!response.data || !response.data.data) {
      throw new Error('Réponse invalide du serveur');
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des formations :", error);
    return handleBackendError(error);
  }
};

// 📁 Fonction pour sauvegarder le document de formation
export const saveDocumentToAssets = async (file: File, formationId: string): Promise<string> => {
  try {
    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `document_${formationId}_${timestamp}.${fileExtension}`;
    const filePath = `src/images/profile/agent/documents_formation/${fileName}`;

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

// 📋 Validation des données formation
export const validateFormationData = (data: FormationPayload): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.nom_formation?.trim()) errors.nom_formation = 'Le nom de la formation est requis';
  if (!data.etablissement?.trim()) errors.etablissement = 'L\'établissement est requis';
  if (!data.experience?.trim()) errors.experience = 'L\'expérience est requise';
  if (!data.annee?.trim()) errors.annee = 'L\'année est requise';
  if (!data.document?.trim()) errors.document = 'Le document est requis';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ➕ Création d'une nouvelle formation avec gestion de fichier
export const createFormation = async (data: FormationPayload, documentFile?: File): Promise<Formation> => {
  try {
    // Valider les données
    const validation = validateFormationData(data);
    if (!validation.isValid) {
      const validationError = new Error(`Données invalides: ${Object.values(validation.errors).join(', ')}`);
      (validationError as any).code = 'VALIDATION_ERROR';
      (validationError as any).errors = validation.errors;
      throw validationError;
    }

    let finalData = { ...data };

    // Si un fichier document est fourni, le sauvegarder
    if (documentFile) {
      try {
        const documentPath = await saveDocumentToAssets(
          documentFile, 
          `temp_${Date.now()}`
        );
        finalData.document = documentPath;
      } catch (fileError) {
        console.warn('Erreur lors de la sauvegarde du fichier, continuons sans:', fileError);
        // On continue même si la sauvegarde du fichier échoue
      }
    }

    console.log('Envoi des données formation:', finalData);
    
    // Préparer les données pour l'envoi
    let requestData;
    let headers = {};
    
    if (documentFile) {
      // Si on a un fichier, utiliser FormData
      const formData = new FormData();
      
      // Ajouter tous les champs de données
      Object.entries(finalData).forEach(([key, value]) => {
        if (key !== 'document') {
          formData.append(key, String(value));
        }
      });
      
      // Ajouter le fichier document
      formData.append('document', documentFile);
      
      requestData = formData;
      headers = {
        'Content-Type': 'multipart/form-data'
      };
    } else {
      // Si pas de fichier, envoyer en JSON normal
      requestData = finalData;
      headers = {
        'Content-Type': 'application/json'
      };
    }
    
    const response = await api.post("/agent/registerFormation", requestData, { headers });
    
    // Vérifier la réponse du backend
    if (!response.data) {
      throw new Error('Réponse invalide du serveur');
    }
    
    // Vérifier si la création a réussi selon la structure de réponse du backend
    if (response.data.success === false) {
      const backendError = new Error(response.data.message || 'Erreur lors de la création de la formation');
      (backendError as any).code = response.data.code;
      (backendError as any).backendResponse = response.data;
      throw backendError;
    }
    
    // Si la création réussit et qu'on a un fichier, on peut mettre à jour le nom avec l'ID réel
    if (response.data.data && documentFile && response.data.data.id) {
      try {
        const realDocumentPath = await saveDocumentToAssets(
          documentFile, 
          response.data.data.id.toString()
        );
        console.log(`Document sauvegardé définitivement: ${realDocumentPath}`);
      } catch (fileError) {
        console.warn('Erreur lors de la sauvegarde finale du fichier:', fileError);
      }
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création de la formation :", error);
    return handleBackendError(error);
  }
};

// ✏️ Mise à jour d'une formation existante
export const updateFormation = async (formationId: number, data: UpdateFormationData): Promise<Formation> => {
  try {
    console.log('Mise à jour de la formation avec ID:', formationId);
    console.log('Données envoyées:', data);
    
    // Vérifier si un fichier est présent
    const hasFile = data.document instanceof File;
    
    let payload: FormData | any;
    let config: any = {
      params: {
        formation_id: formationId
      }
    };

    if (hasFile) {
      // Utiliser FormData pour l'envoi multipart
      const formData = new FormData();
      
      // Ajouter tous les champs au FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      // Ajouter id_op_agent explicitement si présent
      if (data.id_op_agent) {
        formData.append('id_op_agent', String(data.id_op_agent));
      }
      
      payload = formData;
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    } else {
      // Utiliser JSON normal
      payload = data;
    }

    console.log('Payload envoyé:', payload);
    console.log('Config:', config);

    const response = await api.post("/agent/UpdateFormation", payload, config);
    
    console.log('Réponse du serveur:', response.data);
    
    // CORRECTION : Vérifier le code de réponse au lieu de la propriété success
    if (response.data.code !== 200) {
      throw new Error(response.data.message || 'Erreur lors de la mise à jour de la formation');
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la formation :", error);
    throw error;
  }
};

// 🔍 Récupération d'une formation par son ID
export const getFormationById = async (id: number): Promise<Formation> => {
  try {
    const response = await api.get(`/formation/by_id?id=${id}`);
    
    // Vérifier si la réponse est valide
    if (!response.data || !response.data.data) {
      throw new Error('Réponse invalide du serveur');
    }
    
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la formation ${id} :`, error);
    return handleBackendError(error);
  }
};

// 🔄 Fonction utilitaire pour formater les données formation
export const formatFormationData = (formData: any): FormationPayload => {
  return {
    nom_formation: formData.nom_formation?.trim() || '',
    etablissement: formData.etablissement?.trim() || '',
    experience: formData.experience?.trim() || '',
    annee: formData.annee?.trim() || '',
    document: formData.document || '',
    id_op_agent: Number(formData.id_op_agent) || 0,
    id_user_created: formData.id_user_created || ''
  };
};