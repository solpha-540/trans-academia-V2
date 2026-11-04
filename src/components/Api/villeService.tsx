import api from '../Api/axiosConfig';
import { Ville, VillePayload } from '../../types/villeType';

// Récupération de toutes les villes
export const getVilles = async (): Promise<Ville[]> => {
  try {
    const response = await api.get('/region/ville/get');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des villes :', error);
    throw error;
  }
};

// Création d’une nouvelle ville
export const createVille = async (data: VillePayload): Promise<Ville> => {
  try {
    const response = await api.post('/region/ville/create', data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création d’une ville :", error);
    throw error;
  }
};

export const updateVille = async (
  id: number,
  data: { labele: string; Id_province: number; CodeVille: string }
): Promise<Ville> => {
  try {
    const response = await api.put(`/region/ville/update?id=${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la ville :", error);
    throw error;
  }
};

export const deleteVille = async (id: number): Promise<{ id: number }> => {
  try {
    const response = await api.delete(`/region/ville/delete?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la ville :", error);
    throw error;
  }
};