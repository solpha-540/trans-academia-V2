import { Tarif, TarifPayload } from "../../types/tarifsType";
import api from "./axiosConfig";
import { getIdUserCreated, isAuthenticated } from "../../utils/auth";

export const getTarifs = async (bus_location_id?: number): Promise<Tarif[]> => {
  try {
    let url = 'location/tarif';
    if (bus_location_id) {
      url += `?id_bus=${bus_location_id}`;
    }
    
    const response = await api.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tarifs :", error);
    throw error;
  }
};

export const createTarif = async (newTarif: TarifPayload) => {
  try {
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
    const payloadWithUser = {
      ...newTarif,
      id_user_created: id_user_created
    };
    
    console.log('🔧 Payload pour création tarif:', payloadWithUser);
    
    const response = await api.post('/location/tarif/create', payloadWithUser);
    
    console.log('✅ Tarif créé avec succès:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error("❌ Erreur lors de la création du tarif :", error);
    
    // Gestion d'erreur plus détaillée
    if (error.response) {
      // Erreur de l'API
      const errorMessage = error.response.data?.message || error.response.data?.error || "Erreur serveur";
      throw new Error(errorMessage);
    } else if (error.request) {
      // Erreur de réseau
      throw new Error("Erreur de connexion au serveur");
    } else {
      // Erreur côté client
      throw error;
    }
  }
};

export const updateTarif = async (id: number, updatedTarif: Partial<TarifPayload>) => {
  try {
    const response = await api.put(`/location/tarif/update/${id}`, updatedTarif);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du tarif :", error);
    throw error;
  }
};

export const deleteTarif = async (id: number) => {
  try {
    const response = await api.delete(`/location/tarif/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du tarif :", error);
    throw error;
  }
};

// Fonction pour récupérer les tarifs par emplacement de bus
export const getTarifsByBusLocation = async (bus_location_id: number): Promise<Tarif[]> => {
  try {
    const response = await api.get(`/location/tarif?id_bus=${bus_location_id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des tarifs pour l'emplacement de bus ${bus_location_id} :`, error);
    throw error;
  }
};

// Fonction pour récupérer les tarifs par destination
export const getTarifsByDestination = async (destination_id: number): Promise<Tarif[]> => {
  try {
    const response = await api.get(`/location/tarif?destination_id=${destination_id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des tarifs pour la destination ${destination_id} :`, error);
    throw error;
  }
};