import api from "./axiosConfig";
import { getIdUserCreated } from "../../utils/auth";
import {
  AffectationPayload,
  AffectationResponse,
  AffectationResponseData,
  FonctionsByServiceResponse,
  FonctionItem,
} from "../../types/affectationType";

// Re-export types for backward compatibility
export type { AffectationResponse, AffectationPayload, AffectationResponseData };

// Build payload for affectation
const buildPayload = (
  agentId: number,
  serviceId: number,
  fonctionId: number,
  gradeId: number
): AffectationPayload => {
  return {
    agent_id: agentId,
    service_id: serviceId,
    fonction_id: fonctionId,
    grade_id: gradeId,
    Id_user_created_at: getIdUserCreated() || "",
  };
};

// Create affectation with new body structure
export const createAffectation = async (
  agentId: number,
  serviceId: number,
  fonctionId: number,
  gradeId: number
): Promise<AffectationResponse> => {
  try {
    const payload = buildPayload(agentId, serviceId, fonctionId, gradeId);

    const response = await api.post("/agent/AssignAgent", payload, {
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: (status) => {
        return (status >= 200 && status < 300) || status === 400;
      },
    });

    if (response.status === 200 || response.data?.code === 200) {
      return {
        success: true,
        message: response.data?.message || "Affectation créée avec succès",
        data: response.data?.data as AffectationResponseData,
      };
    }

    return {
      success: false,
      message:
        response.data?.message ||
        "Erreur lors de l'affectation de l'agent au service",
      data: response.data?.data,
    };
  } catch (error: any) {
    console.error("Erreur lors de l'affectation de l'agent :", error);

    if (error.response?.data) {
      const backendError = error.response.data;
      return {
        success: false,
        message:
          backendError.message ||
          "Erreur lors de l'affectation de l'agent au service",
        data: backendError.data || undefined,
      };
    }

    return {
      success: false,
      message: error.message || "Erreur de connexion au serveur",
      data: undefined,
    };
  }
};

// Get fonctions by service ID
export const getFonctionsByService = async (
  serviceId: number
): Promise<FonctionsByServiceResponse> => {
  try {
    const response = await api.get(
      `/affectationRh/fonction/service?id_service=${serviceId}`
    );

    if (response.status === 200 || response.data?.code === 200) {
      return {
        success: true,
        message: response.data?.message || "Fonctions récupérées avec succès",
        data: response.data?.data,
      };
    }

    return {
      success: false,
      message:
        response.data?.message ||
        "Erreur lors de la récupération des fonctions",
    };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des fonctions :", error);

    if (error.response?.data) {
      const backendError = error.response.data;
      return {
        success: false,
        message:
          backendError.message ||
          "Erreur lors de la récupération des fonctions",
      };
    }

    return {
      success: false,
      message: error.message || "Erreur de connexion au serveur",
    };
  }
};

// Get fonctions list (simple array) by service ID
export const getFonctionsListByService = async (
  serviceId: number
): Promise<FonctionItem[]> => {
  try {
    const response = await getFonctionsByService(serviceId);
    if (response.success && response.data?.fonctions) {
      return response.data.fonctions;
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des fonctions :", error);
    return [];
  }
};

export const reassignAffectation = async (
  agentId: number,
  serviceId: number,
  fonctionId: number,
  gradeId: number
): Promise<AffectationResponse> => {
  try {
    const payload = buildPayload(agentId, serviceId, fonctionId, gradeId);

    console.log("🔄 Réaffectation - payload envoyé:", payload);

    const response = await api.put("/agent/ReassignAgent", payload, {
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: (status) => {
        return (status >= 200 && status < 300) || status === 400;
      },
    });

    console.log("🔄 Réaffectation - status HTTP:", response.status);
    console.log("🔄 Réaffectation - response.data:", response.data);

    if (response.status === 200 || response.data?.code === 200) {
      return {
        success: true,
        message:
          response.data?.message || "Réaffectation réalisée avec succès",
        data: response.data?.data as AffectationResponseData,
      };
    }

    return {
      success: false,
      message:
        response.data?.message ||
        "Erreur lors de la réaffectation de l'agent au service",
      data: response.data?.data,
    };
  } catch (error: any) {
    console.error("Erreur lors de la réaffectation de l'agent :", error);

    if (error.response) {
      console.log("🔄 Réaffectation - error status:", error.response.status);
      console.log("🔄 Réaffectation - error data:", error.response.data);
    }

    if (error.response?.data) {
      const backendError = error.response.data;
      return {
        success: false,
        message:
          backendError.message ||
          "Erreur lors de la réaffectation de l'agent au service",
        data: backendError.data || undefined,
      };
    }

    return {
      success: false,
      message: error.message || "Erreur de connexion au serveur",
      data: undefined,
    };
  }
};
