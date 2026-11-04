import { Conjoint, ConjointPayload, UpdateConjointData } from "../../types/conjointType";
import api from "./axiosConfig"; // Ton instance Axios

// 🔁 Récupération de la liste des conjoints
export const getConjoints = async (): Promise<Conjoint[]> => {
  try {
    const response = await api.get("/agent/ListeConjoints"); // ← adapte l'URL si nécessaire
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des conjoints :", error);
    throw error;
  }
};

// ➕ Création d’un nouveau conjoint
export const createConjoint = async (data: ConjointPayload): Promise<Conjoint> => {
  try {
    // Si l'acte de mariage est fourni (fichier), on passe en multipart
    const isMultipart = data.acte_mariage instanceof File;

    let payload: FormData | ConjointPayload = data;
    let config = {};

    if (isMultipart) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });
      payload = formData;
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }

    const response = await api.post("/agent/registerConjoint", payload, config);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création du conjoint :", error);
    throw error;
  }
};

// Vérifier si un agent a déjà un conjoint
export const hasConjoint = async (agentId: number): Promise<boolean> => {
  try {
    // D'abord, on récupère tous les conjoints
    const response = await api.get("/agent/ListeConjoints");
    // On filtre pour ne garder que le conjoint de l'agent concerné
    const conjoints = response.data?.data || [];
    const conjointExistant = conjoints.some((conjoint: any) => conjoint.id_op_agent === agentId);
    console.log('Vérification conjoint existant pour agent', agentId, ':', conjointExistant);
    return conjointExistant;
  } catch (error) {
    console.error("Erreur lors de la vérification du conjoint :", error);
    return false; // En cas d'erreur, on considère qu'il n'y a pas de conjoint pour éviter de bloquer l'utilisateur
  }
};
export const updateConjoint = async (conjointId: number, data: UpdateConjointData): Promise<Conjoint> => {
  try {
    console.log('Mise à jour du conjoint avec ID:', conjointId);
    console.log('Données envoyées:', data);
    
    // Vérifier si un fichier est présent
    const hasFile = data.acte_mariage_file instanceof File;
    
    let payload: FormData | any;
    let config: any = {
      params: {
        conjoint_id: conjointId
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

    const response = await api.post("/agent/UpdateConjoint", payload, config);
    
    console.log('Réponse du serveur:', response.data);
    
   // CORRECTION : Vérifier le code de réponse au lieu de la propriété success
   if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Erreur lors de la mise à jour du conjoint');
  }
  
    
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du conjoint :", error);
    throw error;
  }
};
