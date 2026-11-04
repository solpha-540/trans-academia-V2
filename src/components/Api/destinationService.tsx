import { Destination, DestinationPayload } from "../../types/destinationType";
import api from "./axiosConfig";
import { getIdUserCreated, isAuthenticated } from "../../utils/auth"; // Import des fonctions d'auth

export const getDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await api.get('location/destination');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des destinations :", error);
    throw error;
  }
};

export const createDestination = async (newDestination: DestinationPayload) => {
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
      ...newDestination,
      id_user_created: id_user_created
    };
    
    console.log('🔧 Payload pour création destination:', payloadWithUser);
    
    const response = await api.post('/location/destination/create', payloadWithUser);
    
    console.log('✅ Destination créée avec succès:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error("❌ Erreur lors de la création de la destination :", error);
    
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

export const updateDestination = async (id: number, updatedDestination: Partial<DestinationPayload>) => {
  try {
    const response = await api.put(`/location/destination/update/${id}`, updatedDestination);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la destination :", error);
    throw error;
  }
};

export const deleteDestination = async (id: number) => {
  try {
    const response = await api.delete(`/location/destination/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la destination :", error);
    throw error;
  }
};