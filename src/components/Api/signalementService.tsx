import { Signalement } from "../../types/signalementType";

import api from "./axiosConfig"; // Assure-toi que ce fichier exporte bien ton instance Axios

export const getSignalements = async (): Promise<Signalement[]> => {
  try {
    const response = await api.get('/signalement/historique');
    return Array.isArray(response?.data?.data) ? response.data.data : [];
  } catch (error: any) {
    if (error?.response?.status === 404) {
      console.info("Aucun signalement trouvé pour cette requête.");
      return [];
    }
    console.error("Erreur lors de la récupération des signalements :", error);
    throw error;
  }
};


// ✅ Récupérer un signalement par ID
export const getSignalementById = async (id_signalement: number): Promise<Signalement> => {
  try {
    const response = await api.get(`/signalement/by_id?id_signalement`, {
      params: { id_signalement },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du signalement ${id_signalement} :`, error);
    throw error;
  }
};


// ✅ Récupérer les signalements par plage de dates
export const getSignalementsByDateRange = async (dateDebut: string, dateFin: string): Promise<Signalement[]> => {
  try {
    const response = await api.get('/signalement/historique', {
      params: {
        date_debut: dateDebut,
        date_fin: dateFin
      }
    });
    return Array.isArray(response?.data?.data) ? response.data.data : [];
  } catch (error: any) {
    if (error?.response?.status === 404) {
      console.info(`Aucun signalement trouvé pour la plage ${dateDebut} → ${dateFin}.`);
      return [];
    }
    console.error(`Erreur lors de la récupération des signalements entre ${dateDebut} et ${dateFin} :`, error);
    throw error;
  }
};