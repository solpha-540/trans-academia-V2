import { Category } from "../../types/categoryType";
import api from "./axiosConfig"; // Assure-toi que ce fichier exporte bien ton instance Axios


export const getSub_subCategory = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/categorie/sub_souscat/get');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des sous-sous-catégories :", error);
    throw error;
  }
};