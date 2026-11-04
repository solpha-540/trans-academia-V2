import api from '../Api/axiosConfig'; // <-- Assure-toi d'importer ton instance axios personnalisée
import { Grade, GradePayload } from '../../types/gradeType'; // adapte le chemin si besoin

export const getGrades = async (): Promise<Grade[]> => {
  try {
    const response = await api.get('/affectationRh/grade/get');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des grades', error);
    throw error;
  }
};

export const updateGrade = async (
  id: number,
  payload: { libelle: string }
): Promise<Grade> => {
  try {
    const response = await api.put(`/affectationRh/grade/put?id=${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du grade :", error);

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

export const deleteGrade = async (id: number): Promise<{ id: number }> => {
  try {
    const response = await api.delete(`/affectationRh/gradeDelete?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du grade :", error);

    const err = error as any;
    const apiMessage = err?.response?.data?.message;

    if (apiMessage) {
      throw new Error(apiMessage);
    }

    throw error;
  }
};

// Création d’un nouveau grade
export const createGrade = async (data: GradePayload): Promise<Grade> => {
  try {
    const response = await api.post('/affectationRh/grade/create', data); // ← adapte cette URL si besoin
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création d’un grade :", error);

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