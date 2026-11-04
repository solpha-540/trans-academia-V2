import { Ponderation, PonderationPayload } from "../../types/ponderationType";

import api from "./axiosConfig"; // Assure-toi que ce fichier exporte bien ton instance Axios

// Récupération des pondérations
export const getPonderations = async (): Promise<Ponderation[]> => {
  try {
    const response = await api.get('/ponderation');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des pondérations :", error);
    throw error;
  }
};

// Création d'une pondération
export const createPonderation = async (data: PonderationPayload): Promise<Ponderation> => {
  try {
    const response = await api.post('/ponderation/create', data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création de la pondération :", error);
    throw error;
  }
};
