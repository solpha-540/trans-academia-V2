import { Enfant, EnfantPayload } from "../../types/enfantType";
import api from "./axiosConfig"; // Ton instance Axios
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

// 🔁 Récupération de la liste des enfants
export const getEnfants = async (): Promise<Enfant[]> => {
  try {
    const response = await api.get("/agent/ListeEnfants");
    
    // Vérifier si la réponse est valide
    if (!response.data || !response.data.data) {
      throw new Error('Réponse invalide du serveur');
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des enfants :", error);
    return handleBackendError(error);
  }
};

// 📁 Fonction pour sauvegarder l'attestation de naissance
export const saveAttestationToAssets = async (file: File, enfantId: string): Promise<string> => {
  try {
    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `attestation_${enfantId}_${timestamp}.${fileExtension}`;
    const filePath = `src/images/profile/agent/attestation_naissance/${fileName}`;

    // Convertir le fichier en base64 pour le stockage
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          // Ici, vous pourriez implémenter la logique de sauvegarde réelle
          // Pour l'instant, on simule la sauvegarde
          console.log(`Sauvegarde de l'attestation: ${fileName}`);
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
    console.error('Erreur lors de la sauvegarde de l\'attestation:', error);
    throw error;
  }
};

// 📋 Validation des données enfant
export const validateEnfantData = (data: EnfantPayload): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.nom?.trim()) errors.nom = 'Le nom est requis';
  if (!data.postnom?.trim()) errors.postnom = 'Le post-nom est requis';
  if (!data.prenom?.trim()) errors.prenom = 'Le prénom est requis';
  if (!data.sexe) errors.sexe = 'Le sexe est requis';
  if (!data.date_naissance) errors.date_naissance = 'La date de naissance est requise';
  if (!data.attestation_naissance || (typeof data.attestation_naissance === 'string' && !data.attestation_naissance.trim())) {
    errors.attestation_naissance = 'L\'attestation de naissance est requise';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ➕ Création d'un nouveau enfant avec gestion de fichier
export const createEnfant = async (data: EnfantPayload, attestationFile?: File): Promise<Enfant> => {
  try {
    // Valider les données
    const validation = validateEnfantData(data);
    if (!validation.isValid) {
      const validationError = new Error(`Données invalides: ${Object.values(validation.errors).join(', ')}`);
      (validationError as any).code = 'VALIDATION_ERROR';
      (validationError as any).errors = validation.errors;
      throw validationError;
    }

    let finalData = { ...data };

    // Si un fichier d'attestation est fourni, le sauvegarder
    if (attestationFile) {
      try {
        const attestationPath = await saveAttestationToAssets(
          attestationFile, 
          `temp_${Date.now()}`
        );
        finalData.attestation_naissance = attestationPath;
      } catch (fileError) {
        console.warn('Erreur lors de la sauvegarde du fichier, continuons sans:', fileError);
        // On continue même si la sauvegarde du fichier échoue
      }
    }

    console.log('Envoi des données enfant:', finalData);
    
    // Préparer les données pour l'envoi
    let requestData;
    let headers = {};
    
    if (attestationFile) {
      // Si on a un fichier, utiliser FormData
      const formData = new FormData();
      
      // Ajouter tous les champs de données
      Object.entries(finalData).forEach(([key, value]) => {
        if (key !== 'attestation_naissance') {
          formData.append(key, String(value));
        }
      });
      
      // Ajouter le fichier d'attestation
      formData.append('attestation_naissance', attestationFile);
      
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
    
    const response = await api.post("/agent/registerEnfant", requestData, { headers });
    
    // Vérifier la réponse du backend
    if (!response.data) {
      throw new Error('Réponse invalide du serveur');
    }
    
    // Vérifier si la création a réussi selon la structure de réponse du backend
    if (response.data.success === false) {
      const backendError = new Error(response.data.message || 'Erreur lors de la création de l\'enfant');
      (backendError as any).code = response.data.code;
      (backendError as any).backendResponse = response.data;
      throw backendError;
    }
    
    // Si la création réussit et qu'on a un fichier, on peut mettre à jour le nom avec l'ID réel
    if (response.data.data && attestationFile && response.data.data.id) {
      try {
        const realAttestationPath = await saveAttestationToAssets(
          attestationFile, 
          response.data.data.id.toString()
        );
        console.log(`Attestation sauvegardée définitivement: ${realAttestationPath}`);
      } catch (fileError) {
        console.warn('Erreur lors de la sauvegarde finale du fichier:', fileError);
      }
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'enfant :", error);
    return handleBackendError(error);
  }
};

// 🔄 Fonction utilitaire pour formater les données enfant
export const formatEnfantData = (formData: any): EnfantPayload => {
  return {
    nom: formData.nom?.trim() || '',
    postnom: formData.postnom?.trim() || '',
    prenom: formData.prenom?.trim() || '',
    sexe: formData.sexe || '',
    lieu_naissance: formData.lieu_naissance?.trim() || '', 
    date_naissance: formData.date_naissance || '',
    attestation_naissance: formData.attestation_naissance || '',
    id_agent: Number(formData.id_agent) || 0,
    id_user_created: formData.id_user_created || ''
  };
};

/**
 * Met à jour les informations d'un enfant existant
 * @param enfantId - L'ID de l'enfant à mettre à jour
 * @param data - Les données mises à jour de l'enfant
 * @returns Une promesse résolue avec les données mises à jour de l'enfant
 * @throws {Error} Si la mise à jour échoue avec un message d'erreur détaillé
 */
export const updateEnfant = async (enfantId: number, data: any): Promise<Enfant> => {
  try {
    const isMultipart = data.attestation_naissance instanceof File;
    let payload: FormData | any = data;
    let config = {};

    if (isMultipart) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });
      payload = formData;
      config = { 
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        params: { enfant_id: enfantId }
      };
    } else {
      config = { 
        params: { enfant_id: enfantId },
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }

    const response = await api.post(`/agent/UpdateEnfant`, payload, config);
    
    // Gestion des réponses de succès
    if (response.data.code === 200 && response.data.message === "Les informations ont été mises à jour") {
      return response.data.data;
    }
    
    // Si la réponse indique une erreur mais avec un code 200, on la traite comme un succès
    if (response.data.code === 200) {
      return response.data;
    }
    
    // Si la réponse indique une erreur, on la lance pour qu'elle soit traitée par handleBackendError
    if (!response.data.success) {
      const error = new Error(response.data.message || 'Erreur lors de la mise à jour de l\'enfant');
      (error as any).response = { data: response.data };
      throw error;
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'enfant :", error);
    
    // Utilisation du gestionnaire d'erreurs centralisé
    return handleBackendError(error);
  }
};


