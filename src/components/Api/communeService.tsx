
import { Commune, CommunePayload } from "../../types/communeType";


import api from "./axiosConfig"; // Assure-toi que ce fichier exporte bien ton instance Axios

export const getCommunes = async (): Promise<Commune[]> => {
  try {
    const response = await api.get('/region/commune/get');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des communes :", error);
    throw error;
  }
};


export const createCommune = async (data: CommunePayload): Promise<Commune> => {
  try {
    const response = await api.post('/region/commune/create', data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des communes :", error);
    throw error;
  }
};

export const updateCommune = async (
  id: number,
  data: { labele: string; Id_ville: number; created_by_user: string }
): Promise<Commune> => {
  try {
    const response = await api.put(`/region/Commune/update?id=${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commune :", error);
    throw error;
  }
};

export const deleteCommune = async (id: number): Promise<{ id: number }> => {
  try {
    const response = await api.delete(`/region/Commune/delete?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la commune :", error);
    throw error;
  }
};