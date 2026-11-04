import api from '../Api/axiosConfig'; // Assure-toi que ce chemin est correct
import { Province, ProvincePayload } from '../../types/provinceType'; // Crée ce fichier/types si ce n’est pas encore fait

// Récupération de toutes les provinces
export const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await api.get('/region/province/get');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des provinces :', error);
    throw error;
  }
};

// Création d’une nouvelle province
export const createProvince = async (data: ProvincePayload): Promise<Province> => {
  try {
    const response = await api.post('/region/province/create', data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création d’une province :", error);
    throw error;
  }
};

export const updateProvince = async (
  id: number,
  data: { labele: string; code_province: string }
): Promise<Province> => {
  try {
    const response = await api.put(`/region/province/update?id=${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la province :", error);
    throw error;
  }
};

export const deleteProvince = async (id: number): Promise<{ id: number }> => {
  try {
    const response = await api.delete(`/region/province/delete?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la province :", error);
    throw error;
  }
};
