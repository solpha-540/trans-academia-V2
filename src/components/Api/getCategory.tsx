import { Category } from "../../types/categoryType";
import api from "./axiosConfig"; // Assure-toi que ce fichier exporte bien ton instance Axios


export const getCategory = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/categorie/get');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des categories :", error);
    throw error;
  }
};