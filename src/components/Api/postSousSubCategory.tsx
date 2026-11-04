import { Category } from "../../types/categoryType";
import api from "./axiosConfig"; // Assure-toi que ce fichier exporte bien ton instance Axios

interface CreateSousSubCategoryRequest {
  libelle: string;
  id_sous_cat: number;
}

interface CreateSousSubCategoryResponse {
  code: number;
  message: string;
  data: Category;
}

export const postSousSubCategory = async (libelle: string, id_sous_cat: number): Promise<Category> => {
  try {
    const requestBody: CreateSousSubCategoryRequest = {
      libelle,
      id_sous_cat
    };
    
    const response = await api.post<CreateSousSubCategoryResponse>('/categorie/sub_souscat/post', requestBody);
    
    if (response.data.code === 201) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la création de la catégorie');
    }
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie :", error);
    throw error;
  }
};