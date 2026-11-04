import api from './axiosConfig';
import { 
  Bus, 
  BusLinkPayload, 
  BusLinkResponse, 
  BusBreakdownResponse,
  BusBreakdownByLineResponse,
  AffectationHistoryResponse,
  AffectationHistoryParams,
  BusReparationsResponse,
  BusPayload,
} from '../../types/busType';

// Récupérer tous les bus
export const getBus = async (): Promise<Bus[]> => {
  try {
    console.log('=== getBus - Récupération de tous les bus ===');
    const response = await api.get('/bus/get');
    console.log('Réponse brute de l\'API getBus:', response);
    console.log('response.data:', response.data);
    console.log('response.data.data:', response.data.data);
    console.log('Nombre de bus récupérés:', response.data.data?.length || 0);
    console.log('Liste complète des bus:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des bus :', error);
    throw error;
  }
};

export const createBus = async (
  payload: BusPayload
): Promise<Bus> => {
  try {
    const response = await api.post(
      '/bus/create',
      payload
    );

    return response.data.data;

  } catch (error) {

    console.error(
      'Erreur lors de la création du bus :',
      error
    );

    const err = error as any;

    const status = err?.response?.status;

    const apiMessage =
      err?.response?.data?.message;

    if (status === 409 && apiMessage) {
      throw new Error(apiMessage);
    }

    if (apiMessage) {
      throw new Error(apiMessage);
    }

    throw error;
  }
};

// Ajoutez cette fonction dans busService.ts
export const getBusBreakdownsByLineAndDate = async (
  id_bus: number, 
  id_ligne: number, 
  date_debut: string, 
  date_fin: string
): Promise<BusBreakdownByLineResponse> => {
  try {
    const response = await api.get('/bus/getpannebusweb', { 
      params: { 
        id_bus, 
        id_ligne, 
        date_debut, 
        date_fin 
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des pannes par ligne et date :', error);
    throw error;
  }
};

// Lier un bus à une carte
export const linkBus = async (payload: BusLinkPayload): Promise<BusLinkResponse> => {
  try {
    const response = await api.post('/bus/liaison', payload);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la liaison bus-carte :', error);

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

// Obtenir le dernier signalement et les infos opération pour un bus spécifique
export const fetchBusForOperation = async (busId: number) => {
  try {
    const response = await api.get(`/bus/getforoperation`, { params: { bus_id: busId } });
    return response.data.data; // { signalement, resultat_mecanique }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations opérationnelles du bus :', error);
    throw error;
  }
};

// Récupérer l'historique des pannes d'un bus
export const getBusBreakdowns = async (busId: number): Promise<BusBreakdownResponse> => {
  try {
    const response = await api.get('/bus/getpannebus', { 
      params: { id_bus: busId } 
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des pannes :', error);
    throw error;
  }
};

// Mettre à jour le statut d'un bus (ex: VALIDE)
export const updateBusStatus = async (busId: number, status: string) => {
  try {
    console.log('Tentative de mise à jour du statut du bus :', { busId, status });
    
    const payload = { status };
    console.log('Payload envoyé :', payload);
    
    // Envoyer la requête avec le bus_id dans l'URL et le status dans le corps
    const response = await api.put(`/bus/status_bus/update?bus_id=${busId}`, payload);
    
    console.log('Réponse du serveur :', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du statut du bus :', error);
    
    // Afficher plus de détails sur l'erreur si disponible
    if (error.response) {
      console.error('Détails de l\'erreur :', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('Aucune réponse reçue :', error.request);
    } else {
      console.error('Erreur lors de la configuration de la requête :', error.message);
    }
    
    throw error;
  }
};

// Récupérer l'historique des affectations
export const getAffectationHistory = async (
  params?: AffectationHistoryParams
): Promise<AffectationHistoryResponse> => {
  try {
    console.log('Récupération de l\'historique des affectations avec params:', params);
    
    const response = await api.get('/affectationRs/historique/web', {
      params: params || {}
    });
    
    console.log('Réponse historique affectations:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'historique des affectations :', error);
    
    if (error.response) {
      console.error('Détails de l\'erreur :', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    throw error;
  }
};

// Assurez-vous que cette fonction est correcte dans busService.ts
export const getBusReparationsByPeriod = async (
  id_bus: number,
  date_debut: string,
  date_fin: string
): Promise<BusReparationsResponse> => {
  try {
    console.log('=== getBusReparationsByPeriod ===');
    console.log('id_bus envoyé:', id_bus);
    console.log('date_debut:', date_debut);
    console.log('date_fin:', date_fin);
    
    // Vérifiez que l'ID est valide
    if (!id_bus || id_bus <= 0) {
      console.error('ID bus invalide:', id_bus);
      throw new Error('ID du bus invalide');
    }
    
    const params = new URLSearchParams();
    params.append('id_bus', id_bus.toString());
    params.append('date_debut', date_debut);
    params.append('date_fin', date_fin);
    
    const url = `/bus/bus_reparations_by_id?${params.toString()}`;
    console.log('URL complète:', url);
    
    const response = await api.get(url);
    
    console.log('Réponse complète:', response);
    console.log('Réponse réparations bus:', response.data);
    console.log('response.data.nb_reparations:', response.data?.data?.nb_reparations);
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des réparations du bus :', error);
    throw error;
  }
};

// Version avec pagination
export const getAffectationHistoryPaginated = async (
  page: number = 1, 
  limit: number = 20,
  params?: AffectationHistoryParams
): Promise<AffectationHistoryResponse> => {
  try {
    const requestParams = {
      page,
      limit,
      ...params
    };
    
    console.log('Récupération paginée historique affectations:', requestParams);
    
    const response = await api.get('/affectationRs/historique/web', {
      params: requestParams
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des affectations paginé :', error);
    throw error;
  }
};
