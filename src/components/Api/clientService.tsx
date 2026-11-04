import { Client, ClientPayload } from "../../types/clientType";
import api from "./axiosConfig";
import { getIdUserCreated, isAuthenticated } from "../../utils/auth";

export const getAllClients = async (): Promise<Client[]> => {
  try {
    const response = await api.get('location/client');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
    throw error;
  }
};

export const createClient = async (data: ClientPayload): Promise<Client> => {
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

    console.log('🔧 Payload pour création client:', payloadWithUser);
    
    const response = await api.post('/location/client/create', payloadWithUser);
    
    console.log('✅ Client créé avec succès:', response.data);
    return response.data.data;
    
  } catch (error: any) {
    console.error("❌ Erreur lors de la création du client :", error);
    
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

export const updateClient = async (id: number, data: Partial<ClientPayload>): Promise<Client> => {
  try {
    const response = await api.put(`/location/client/update/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du client ${id} :`, error);
    throw error;
  }
};

export const deleteClient = async (id: number): Promise<void> => {
  try {
    await api.delete(`/location/client/delete/${id}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du client ${id} :`, error);
    throw error;
  }
};