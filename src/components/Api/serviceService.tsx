import { Service, ServiceBusBreakdown } from "../../types/serviceType"; // Import depuis serviceType.ts
import api from "./axiosConfig";

export const getServices = async (): Promise<[Service]> => {
  try {
    const response = await api.get('/affectationRh/service_rh/get');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des services :", error);
    throw error;
  }
};

export const updateService = async (
  id: number,
  payload: { libelle: string }
): Promise<Service> => {
  try {
    const response = await api.put(`/affectationRh/service_rh/create?id=${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du service :", error);

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

export const deleteService = async (id: number): Promise<{ id: number }> => {
  try {
    const response = await api.delete(`/affectationRh/service_rhDelete?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du service :", error);

    const err = error as any;
    const apiMessage = err?.response?.data?.message;

    if (apiMessage) {
      throw new Error(apiMessage);
    }

    throw error;
  }
};

export const createService = async (payload: { id_direction: number; libelle: string }) => {
  try {
    const response = await api.post('/affectationRh/service_rh/create', payload);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du service :", error);

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

// Fonction pour récupérer les statistiques des pannes par service
export const getBusBreakdownsByService = async (
  serviceId: number,
  dateDebut: string,
  dateFin: string
): Promise<ServiceBusBreakdown[]> => {
  try {
    const response = await api.get('/bus/bus_panne_by_service', {
      params: {
        id_service: serviceId,
        date_debut: dateDebut,
        date_fin: dateFin
      }
    });
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des pannes de bus :", error);
    
    const err = error as any;
    const apiMessage = err?.response?.data?.message;
    
    if (apiMessage) {
      throw new Error(apiMessage);
    }
    
    throw error;
  }
};