import { Collation, CollationPayload } from "../../types/collationType";
import api from "./axiosConfig";
import { getIdUserCreated, isAuthenticated } from "../../utils/auth";

export const getAllCollations = async (): Promise<Collation[]> => {
  try {
    const response = await api.get('location/collation');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des collations :", error);
    throw error;
  }
};

export const createCollation = async (data: CollationPayload): Promise<Collation> => {
  try {
    if (!isAuthenticated()) {
      throw new Error("Utilisateur non authentifié. Veuillez vous reconnecter.");
    }

    const id_user_created = getIdUserCreated();
    
    if (!id_user_created) {
      throw new Error("ID utilisateur non trouvé. Veuillez vous reconnecter.");
    }

    const payloadWithUser = {
      ...data,
      id_user_created: id_user_created
    };

    console.log('🔧 Payload pour création collation:', payloadWithUser);
    
    const response = await api.post('/location/collation/create', payloadWithUser);
    
    console.log('✅ Collation créée avec succès:', response.data);
    return response.data.data;
    
  } catch (error: any) {
    console.error("❌ Erreur lors de la création de la collation :", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "Erreur serveur";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("Erreur de connexion au serveur");
    } else {
      throw error;
    }
  }
};

export const updateCollation = async (id: number, data: Partial<CollationPayload>): Promise<Collation> => {
  try {
    const response = await api.put(`/location/collation/update/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la collation ${id} :`, error);
    throw error;
  }
};

export const deleteCollation = async (id: number): Promise<void> => {
  try {
    await api.delete(`/location/collation/delete/${id}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de la collation ${id} :`, error);
    throw error;
  }
};

export const getCollationsByBus = async (bus_location_id: number): Promise<Collation[]> => {
  try {
    const response = await api.get(`/location/collation?bus_id=${bus_location_id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des collations pour le bus ${bus_location_id} :`, error);
    throw error;
  }
};