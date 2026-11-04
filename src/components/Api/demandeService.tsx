import api from "./axiosConfig";

import { AxiosError } from "axios";

import { getAgentId } from "../../utils/auth";

import {

  Demande,

  DemandePayload,

  DemandeHistoryItem,

} from "../../types/demandeType";



interface BackendErrorResponse {

  success?: boolean;

  message?: string;

  code?: string | number;

  errors?: Record<string, string[]>;

}



const handleBackendError = (error: unknown): never => {

  if (error instanceof AxiosError) {

    const backendError = error.response?.data as BackendErrorResponse;



    if (backendError) {

      let errorMessage = backendError.message || "Une erreur est survenue";



      if (backendError.errors) {

        const validationErrors = Object.entries(backendError.errors)

          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)

          .join("; ");

        errorMessage += ` - Détails: ${validationErrors}`;

      }



      if (backendError.code) {

        errorMessage += ` (Code: ${backendError.code})`;

      }



      const customError = new Error(errorMessage);

      (customError as any).status = error.response?.status;

      (customError as any).code = backendError.code;

      (customError as any).backendResponse = backendError;

      throw customError;

    }



    const httpError = new Error(

      `Erreur HTTP ${error.response?.status}: ${

        error.response?.statusText || "Erreur inconnue"

      }`

    );

    (httpError as any).status = error.response?.status;

    throw httpError;

  }



  if (error instanceof Error) {

    throw error;

  }



  throw new Error("Une erreur inconnue est survenue");

};



// Validation minimale côté client

export const validateDemandePayload = (data: DemandePayload): {

  isValid: boolean;

  errors: Record<string, string>;

} => {

  const errors: Record<string, string> = {};



  if (!data.type_demande?.trim()) {

    errors.type_demande = "Le type de demande est requis";

  }



  if (!data.message?.trim()) {

    errors.message = "Le message est requis";

  }



  if (!data.id_agent_recepteur || data.id_agent_recepteur <= 0) {

    errors.id_agent_recepteur = "Le récepteur est invalide";

  }



  return {

    isValid: Object.keys(errors).length === 0,

    errors,

  };

};



// ➤ Create demande

export const createDemande = async (payload: DemandePayload): Promise<Demande> => {

  try {

    const storedAgentId = getAgentId();

    const parsedAgentId = storedAgentId ? Number(storedAgentId) : NaN;

    const normalizedPayload: DemandePayload = {

      ...payload,

      id_agent_demandeur:

        payload.id_agent_demandeur ??

        (Number.isFinite(parsedAgentId) && parsedAgentId > 0 ? parsedAgentId : undefined),

    };

    const { isValid, errors } = validateDemandePayload(normalizedPayload);

    if (!isValid) {

      const validationError = new Error("Données invalides");

      (validationError as any).validationErrors = errors;

      throw validationError;

    }

    const response = await api.post("/demande/create", normalizedPayload);

    return response.data.data || response.data;

  } catch (error) {

    console.error("Erreur lors de la création de la demande :", error);

    return handleBackendError(error);

  }

};



// ➤ Get historic for demandeur

export const getDemandesByDemandeur = async (

  id_demandeur: number

): Promise<DemandeHistoryItem[]> => {

  try {

    const response = await api.get(

      `/demande/by_id_demandeur?id_demandeur=${id_demandeur}`

    );

    return response.data.data || response.data;

  } catch (error) {

    console.error(

      "Erreur lors de la récupération de l'historique demandeur :",

      error

    );

    return handleBackendError(error);

  }

};



// ➤ Get historic for recepteur

export const getDemandesByRecepteur = async (

  id_recepteur: number

): Promise<DemandeHistoryItem[]> => {

  try {

    console.log("[DemandeAPI] getDemandesByRecepteur", { id_recepteur });

    const response = await api.get(

      `/demande/by_id_recepteur?id_recepteur=${id_recepteur}`

    );

    const data = response.data.data || response.data;

    console.log("[DemandeAPI] getDemandesByRecepteur result", {

      count: Array.isArray(data) ? data.length : undefined,

      keys: data && typeof data === "object" ? Object.keys(data) : undefined,

    });

    return data;

  } catch (error) {

    console.error(

      "Erreur lors de la récupération de l'historique récepteur :",

      error

    );

    return handleBackendError(error);

  }

};