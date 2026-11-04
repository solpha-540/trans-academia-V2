import { Direction } from "../../types/directionType";

import api from "./axiosConfig"; // Assure-toi que ce fichier exporte bien ton instance Axios

export const getDirections = async (): Promise<Direction[]> => {
  try {
    const response = await api.get('/affectationRh/direction/get');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des directions :", error);
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


export const createDirection = async (newDirection: { libele: string }) => {
  try {
    const response = await api.post('/affectationRh/direction/create', newDirection);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la direction :", error);
    throw error;
  }
};

export const updateDirection = async (
  id: number,
  payload: { libele: string }
): Promise<Direction> => {
  try {
    const response = await api.put(`/affectationRh/direction/put?id=${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la direction :", error);

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

export const deleteDirection = async (id: number): Promise<{ id: number }> => {
  try {
    const response = await api.delete(`/affectationRh/directionDelete?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la direction :", error);

    const err = error as any;
    const apiMessage = err?.response?.data?.message;

    if (apiMessage) {
      throw new Error(apiMessage);
    }

    throw error;
  }
};