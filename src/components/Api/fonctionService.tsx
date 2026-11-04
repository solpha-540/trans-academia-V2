import { Fonction, FonctionPayload } from "../../types/fonctionType";

import api from "./axiosConfig"; // Assure-toi que ce fichier exporte bien ton instance Axios

export const getFonctions = async (): Promise<Fonction[]> => {
  try {
    const response = await api.get('/affectationRh/fonction/get');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des fonctions :", error);
    throw error;
  }
};

export const createFonction = async (fonction: FonctionPayload): Promise<void> => {
  try {
   const response = await api.post("/affectationRh/fonction/create", fonction);
   return response.data.data
  } catch (error) {
    console.error("Erreur lors de la création de la fonction :", error);

    const err = error as any;
    const status = err?.response?.status;
    const apiMessage = err?.response?.data?.message;

    if (status === 409 && apiMessage) {
      throw new Error(apiMessage);
    }

    if (apiMessage) {
      throw new Error(apiMessage);
    }

    throw error;
  }
};

export const updateFonction = async (
  id: number,
  payload: { libelle: string }
): Promise<Fonction> => {
  try {
    const response = await api.put(`/affectationRh/fonction/create?id=${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la fonction :", error);

    const err = error as any;
    const status = err?.response?.status;
    const apiMessage = err?.response?.data?.message;

    if (status === 409 && apiMessage) {
      throw new Error(apiMessage);
    }

    if (apiMessage) {
      throw new Error(apiMessage);
    }

    throw error;
  }
};

export const deleteFonction = async (id: number): Promise<{ id: number }> => {
  try {
    const response = await api.delete(`/affectationRh/fonctionDelete?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la fonction :", error);

    const err = error as any;
    const apiMessage = err?.response?.data?.message;

    if (apiMessage) {
      throw new Error(apiMessage);
    }

    throw error;
  }
};