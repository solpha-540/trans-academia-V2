import api from './axiosConfig';
import { BusLocation, BusLocationPayload } from '../../types/busLocationType';
import { getIdUserCreated, isAuthenticated } from '../../utils/auth';
import { BusByLocationServiceResponse } from '../../types/busLocationType';

// Récupérer tous les emplacements de bus
export const getAllBusLocations = async (): Promise<BusLocation[]> => {
  try {
    const response = await api.get('/location/bus_location');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des emplacements de bus :', error);
    throw error;
  }
};

// Créer un nouvel emplacement de bus
export const createBusLocation = async (newBusLocation: Omit<BusLocationPayload, 'id_user_created'>): Promise<BusLocation> => {
  try {
    console.log('📡 SERVICE - Début createBusLocation');
    
    // Vérifier que l'utilisateur est authentifié
    if (!isAuthenticated()) {
      throw new Error("Utilisateur non authentifié. Veuillez vous reconnecter.");
    }

    // Récupérer l'ID utilisateur via la fonction d'authentification
    const id_user_created = getIdUserCreated();
    
    if (!id_user_created) {
      throw new Error("ID utilisateur non trouvé. Veuillez vous reconnecter.");
    }
    
    // Préparer le payload complet avec l'ID utilisateur
    const payloadWithUser: BusLocationPayload = {
      ...newBusLocation,
      id_user_created: id_user_created
    };
    
    console.log('🎯 Endpoint: POST /location/bus_location/create');
    console.log('📦 Payload complet envoyé au backend:', payloadWithUser);
    
    const response = await api.post('/location/bus_location/create', payloadWithUser);
    
    console.log('✅ SERVICE - Réponse du backend:', response.data);
    return response.data.data;
    
  } catch (error: any) {
    console.error('❌ SERVICE - Erreur createBusLocation:', error);
    
    // Gestion d'erreur détaillée
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "Erreur serveur";
      console.error('📋 Détails erreur service:', {
        status: error.response.status,
        message: errorMessage,
        data: error.response.data
      });
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('📋 Erreur réseau:', error.request);
      throw new Error("Erreur de connexion au serveur");
    } else {
      console.error('📋 Erreur côté client:', error.message);
      throw error;
    }
  }
};

// Récupérer un emplacement de bus par ID
export const getBusLocationById = async (id: number): Promise<BusLocation> => {
  try {
    console.log('🔍 SERVICE - getBusLocationById appelé avec ID:', id);
    
    const response = await api.get(`/location/bus_location?id=${id}`);
    
    console.log('✅ SERVICE - Réponse reçue:', response.data);
    
    // CORRECTION : Retourner le premier élément du tableau
    const data = response.data.data;
    if (Array.isArray(data) && data.length > 0) {
      console.log('🔄 SERVICE - Extraction du premier élément du tableau');
      return data[0];
    } else if (Array.isArray(data) && data.length === 0) {
      throw new Error(`Aucun bus trouvé avec l'ID ${id}`);
    } else {
      return data;
    }
    
  } catch (error) {
    console.error(`❌ SERVICE - Erreur lors de la récupération de l'emplacement de bus ${id}:`, error);
    throw error;
  }
};

// Mettre à jour un emplacement de bus
export const updateBusLocation = async (id: number, payload: Partial<BusLocationPayload>): Promise<BusLocation> => {
  try {
    const response = await api.put(`/location/bus_location/update?id=${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'emplacement de bus ${id} :`, error);
    throw error;
  }
};

// Supprimer un emplacement de bus
export const deleteBusLocation = async (id: number): Promise<void> => {
  try {
    await api.delete(`/location/bus_location/delete?id=${id}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'emplacement de bus ${id} :`, error);
    throw error;
  }
};

// Mettre à jour le statut et le bus_reste d'un bus
export const updateBusLocationStatus = async (busId: number, status: string, bus_reste: number): Promise<BusLocation> => {
  try {
    console.log('📡 SERVICE - Début updateBusLocationStatus');
    console.log('🎯 Paramètres:', { busId, status, bus_reste });

    if (!isAuthenticated()) {
      throw new Error("Utilisateur non authentifié. Veuillez vous reconnecter.");
    }

    const id_user_created = getIdUserCreated();
    if (!id_user_created) {
      throw new Error("ID utilisateur non trouvé. Veuillez vous reconnecter.");
    }

    const payload = {
      status: status,
      bus_reste: bus_reste,
      id_user_created: id_user_created
    };

    console.log('🎯 Endpoint: PUT /location/bus_location/updatestatut');
    console.log('📦 Payload envoyé:', payload);
    console.log('🔗 URL complète:', `/location/bus_location/updatestatut?bus_id=${busId}`);

    const response = await api.put(`/location/bus_location/updatestatut?bus_id=${busId}`, payload);
    
    console.log('✅ SERVICE - Statut et bus_reste mis à jour avec succès:', response.data);
    return response.data.data;
    
  } catch (error: any) {
    console.error('❌ SERVICE - Erreur updateBusLocationStatus:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "Erreur serveur";
      console.error('📋 Détails erreur service:', {
        status: error.response.status,
        message: errorMessage,
        data: error.response.data
      });
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('📋 Erreur réseau:', error.request);
      throw new Error("Erreur de connexion au serveur");
    } else {
      console.error('📋 Erreur côté client:', error.message);
      throw error;
    }
  }
};


// Récupérer tous les signalements d'un bus par ID
export const getAllBusReports = async (busId: number): Promise<any[]> => {
  try {
    console.log('📡 SERVICE - Début getAllBusReports');
    console.log('🎯 ID Bus:', busId);

    const response = await api.get(`/signalement/detail-by-bus?id_bus=${busId}`);
    
    console.log('✅ SERVICE - Signalements récupérés avec succès:', response.data);
    return response.data.data;  // Assuming the response contains a `data` field with the list of reports
    
  } catch (error: any) {
    console.error('❌ SERVICE - Erreur getAllBusReports:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "Erreur serveur";
      console.error('📋 Détails erreur service:', {
        status: error.response.status,
        message: errorMessage,
        data: error.response.data
      });
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('📋 Erreur réseau:', error.request);
      throw new Error("Erreur de connexion au serveur");
    } else {
      console.error('📋 Erreur côté client:', error.message);
      throw error;
    }
  }
};


// Mettre à jour le type d'un bus
export const updateBusLocationType = async (busId: number, typeBus: string): Promise<BusLocation> => {
  try {
    console.log('📡 SERVICE - Début updateBusLocationType');
    console.log('🎯 Paramètres:', { busId, typeBus });

    if (!isAuthenticated()) {
      throw new Error("Utilisateur non authentifié. Veuillez vous reconnecter.");
    }

    const id_user_created = getIdUserCreated();
    if (!id_user_created) {
      throw new Error("ID utilisateur non trouvé. Veuillez vous reconnecter.");
    }

    const payload = {
      type_bus: typeBus,
      id_user_created: id_user_created
    };

    console.log('🎯 Endpoint: PUT /location/bus_location/update');
    console.log('📦 Payload envoyé:', payload);

    const response = await api.put(`/location/bus_location/update?id=${busId}`, payload);
    
    console.log('✅ SERVICE - Type mis à jour avec succès:', response.data);
    return response.data.data;
    
  } catch (error: any) {
    console.error('❌ SERVICE - Erreur updateBusLocationType:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "Erreur serveur";
      console.error('📋 Détails erreur service:', {
        status: error.response.status,
        message: errorMessage,
        data: error.response.data
      });
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('📋 Erreur réseau:', error.request);
      throw new Error("Erreur de connexion au serveur");
    } else {
      console.error('📋 Erreur côté client:', error.message);
      throw error;
    }
  }
};

// Interface pour la réponse des bus par service de location


// Récupérer les bus par service de location
export const getBusByLocationService = async (id_service: number): Promise<BusByLocationServiceResponse > => {
  try {
    console.log('📡 SERVICE - Début getBusByLocationService');
    console.log('🎯 ID Service:', id_service);

    const response = await api.get(`/planning?id_service=${id_service}`);
    
    console.log('✅ SERVICE - Bus par service de location récupérés avec succès:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('❌ SERVICE - Erreur getBusByLocationService:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "Erreur serveur";
      console.error('📋 Détails erreur service:', {
        status: error.response.status,
        message: errorMessage,
        data: error.response.data
      });
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('📋 Erreur réseau:', error.request);
      throw new Error("Erreur de connexion au serveur");
    } else {
      console.error('📋 Erreur côté client:', error.message);
      throw error;
    }
  }
};

// Export par défaut pour faciliter les imports
export default {
  getAllBusLocations,
  createBusLocation,
  getBusLocationById,
  updateBusLocation,
  deleteBusLocation,
  updateBusLocationStatus,
  updateBusLocationType,
  getBusByLocationService
};