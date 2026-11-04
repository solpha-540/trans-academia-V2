import { Category } from "../../types/categoryType";
import api from "./axiosConfig"; // Assure-toi que ce fichier exporte bien ton instance Axios

interface CreateSubCategoryRequest {
  libelle: string;
  id_categorie: number;
}

interface CreateSubCategoryResponse {
  code: number;
  message: string;
  data: Category;
}

export const postSubCategory = async (libelle: string, id_categorie: number): Promise<Category> => {
  try {
    const requestBody: CreateSubCategoryRequest = {
    libelle,
    id_categorie
    };
    
    const response = await api.post<CreateSubCategoryResponse>('/categorie/souscat/create', requestBody);
    
    if (response.data.code === 201) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la création de la sous catégorie');
    }
  } catch (error) {
    console.error("Erreur lors de la création de la sous catégorie :", error);
    throw error;
  }
};