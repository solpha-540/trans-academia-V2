import api from '../Api/axiosConfig'; // Ton instance axios
import { Ligne, LignePayload } from '../../types/ligneType'; // Adapte le chemin selon ton projet

// Récupération de toutes les lignes
export const getLignes = async (): Promise<Ligne[]> => {
  try {
    const response = await api.get('lignes');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des lignes', error);
    throw error;
  }
};

// Création d’une nouvelle ligne
export const createLigne = async (data: LignePayload): Promise<Ligne> => {
  try {
    const response = await api.post('lignes/create', data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création d’une ligne :", error);
    throw error;
  }
};
