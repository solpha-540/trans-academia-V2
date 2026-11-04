import { Category } from "../../types/categoryType";
import api from "./axiosConfig"; // Assure-toi que ce fichier exporte bien ton instance Axios

// ✅ On étend le type pour inclure ponderationId
interface CreateCategoryRequest {
  libelle: string;
  ponderationId: number;
}

interface CreateCategoryResponse {
  code: number;
  message: string;
  data: Category;
}

export const postCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  try {
    const response = await api.post<CreateCategoryResponse>('/categorie/create', data);

    if (response.data.code === 201) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la création de la catégorie');
    }
  } catch (error) {
    console.error("Erreur lors de création de la catégorie :", error);
    throw error;
  }
};
