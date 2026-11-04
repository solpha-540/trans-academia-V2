import { SignalementBySession, SignalementBySessionParams, Session } from "../../types/signalementBySessionType";
import api from "./axiosConfig";

/**
 * Récupérer les signalements par session
 * @param params - Paramètres de filtrage (id_session requis, date_debut et date_fin optionnels)
 * @returns Promise<SignalementBySession[]>
 */
export const getSignalementsBySession = async (params: SignalementBySessionParams): Promise<SignalementBySession[]> => {
  try {
    const queryParams: Record<string, string | number> = {
      id_session: params.id_session,
    };

    if (params.date_debut) {
      queryParams.date_debut = params.date_debut;
    }

    if (params.date_fin) {
      queryParams.date_fin = params.date_fin;
    }

    const response = await api.get('/signalement/data-by-session', {
      params: queryParams,
    });

    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des signalements par session :", error);
    throw error;
  }
};

/**
 * Récupérer la liste des sessions disponibles
 * @returns Promise<Session[]>
 */
export const getSessions = async (): Promise<Session[]> => {
  try {
    const response = await api.get('/session');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions :", error);
    throw error;
  }
};

/**
 * Récupérer un signalement par ID
 * @param id_signalement - ID du signalement
 * @returns Promise<SignalementBySession>
 */
export const getSignalementBySessionById = async (id_signalement: number): Promise<SignalementBySession> => {
  try {
    const response = await api.get('/signalement/by_id', {
      params: { id_signalement },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du signalement ${id_signalement} :`, error);
    throw error;
  }
};

/**
 * Récupérer les signalements par session avec filtre de dates
 * @param id_session - ID de la session (requis)
 * @param dateDebut - Date de début (optionnel)
 * @param dateFin - Date de fin (optionnel)
 * @returns Promise<SignalementBySession[]>
 */
export const getSignalementsBySessionWithDateFilter = async (
  id_session: number,
  dateDebut?: string,
  dateFin?: string
): Promise<SignalementBySession[]> => {
  return getSignalementsBySession({
    id_session,
    date_debut: dateDebut,
    date_fin: dateFin,
  });
};
