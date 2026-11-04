
import { AxiosError } from "axios";
import { AptitudePhysique, AptitudePhysiquePayload, UpdateAptitudeData } from "../../types/aptitudePhysiqueType";
import api from "./axiosConfig"; // ← ton instance Axios

// Récupération de toutes les aptitudes physiques
export const getAptitudesPhysiques = async (): Promise<AptitudePhysique[]> => {
  try {
    const response = await api.get('/agent/ListeAptitudes'); // ← adapte l'URL selon ton API
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des aptitudes physiques :", error);
    throw error;
  }
};

// Création d’une nouvelle aptitude physique
export const createAptitudePhysique = async (data: AptitudePhysiquePayload): Promise<AptitudePhysique> => {
  try {
    const response = await api.post('/agent/registerAptitude', data); // ← adapte l'URL selon ton API
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création d’une aptitude physique :", error);
    throw error;
  }
};


export const updateAptitudePhysique = async (
  aptitudeId: number,
  data: UpdateAptitudeData
): Promise<AptitudePhysique> => {
  try {
    const response = await api.post(`/agent/UpdateAptitude`, data, {
      params: { aptitude_physique_id: aptitudeId },
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.code === 200 && response.data.message === "Les informations ont été mises à jour") {
      return response.data.data;
    }

    return response.data.data;
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour de l’aptitude physique :", error);

    if (error instanceof AxiosError) {
      console.error("Détails de l’erreur Axios :", error.response?.data);
    }

    throw error;
  }
};
