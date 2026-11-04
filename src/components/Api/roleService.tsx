import { Role } from "../../types/role";
import api from "./axiosConfig";

export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await api.get('/roles');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des fonctions (roles)', error);
    throw error;
  }
};

export const updateRole = async (
  id: number,
  payload: { libelle: string }
): Promise<Partial<Role>> => {
  try {
    const response = await api.put(`/roles/create?id=${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle", error);

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

export const deleteRole = async (id: number): Promise<{ id: number }> => {
  try {
    const response = await api.delete(`/roles/delete?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du rôle", error);

    const err = error as any;
    const apiMessage = err?.response?.data?.message;

    if (apiMessage) {
      throw new Error(apiMessage);
    }

    throw error;
  }
};

// Créer un nouveau rôle
export const createRole = async (roleData: Partial<Role>): Promise<Role> => {
  try {
    const response = await api.post('/roles/create', roleData);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la création du rôle", error);

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