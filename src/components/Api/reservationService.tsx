// services/reservationService.ts
import { Reservation, ReservationPayload, ReservationFilters } from "../../types/reservationType";
import api from "./axiosConfig";
import { getIdUserCreated, isAuthenticated } from "../../utils/auth";

export const getAllReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await api.get('location/reservation');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    throw error;
  }
};

export const createReservation = async (data: ReservationPayload): Promise<Reservation> => {
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

    console.log('🔧 Payload pour création réservation:', payloadWithUser);
    
    const response = await api.post('/location/reservation/create', payloadWithUser);
    
    console.log('✅ Réservation créée avec succès:', response.data);
    return response.data.data;
    
  } catch (error: any) {
    console.error("❌ Erreur lors de la création de la réservation :", error);
    
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


export const addPaymentProof = async (reservationId: number, file: File): Promise<any> => {
  try {
    if (!isAuthenticated()) {
      throw new Error("Utilisateur non authentifié. Veuillez vous reconnecter.");
    }

    const id_user_created = getIdUserCreated();
    
    if (!id_user_created) {
      throw new Error("ID utilisateur non trouvé. Veuillez vous reconnecter.");
    }

    const formData = new FormData();
    formData.append('preuve_paiement', file);
    formData.append('id_user_created', id_user_created);
    formData.append('reservation_id', reservationId.toString()); // Ajout dans le body

    const response = await api.post(
      `/location/reservation/addPreuvepaiement`, // Retirer le paramètre d'URL
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error adding payment proof:', error);
    throw error;
  }
};

export const updateReservation = async (id: number, data: Partial<ReservationPayload>): Promise<Reservation> => {
  try {
    const response = await api.put(`/location/reservation/update?id=${id}`, data);
    return response.data.data;
  } catch (error: any) {
    console.error(`❌ Erreur lors de la mise à jour de la réservation ${id} :`, error);
    
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

export const updateReservationStatus = async (id: number, status: string): Promise<Reservation> => {
  try {
    if (!isAuthenticated()) {
      throw new Error("Utilisateur non authentifié. Veuillez vous reconnecter.");
    }

    const id_user_created = getIdUserCreated();
    
    if (!id_user_created) {
      throw new Error("ID utilisateur non trouvé. Veuillez vous reconnecter.");
    }

    const payload = {
      status: status,
      id_user_created: id_user_created
    };

    console.log('🔧 Payload pour mise à jour statut:', { id, payload });
    
    const response = await api.put(`/location/reservation/updateStatut?id=${id}`, payload);
    
    console.log('✅ Statut réservation mis à jour avec succès:', response.data);
    return response.data.data;
    
  } catch (error: any) {
    console.error("❌ Erreur lors de la mise à jour du statut :", error);
    
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

export const deleteReservation = async (id: number): Promise<void> => {
  try {
    await api.delete(`/location/reservation/delete/${id}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de la réservation ${id} :`, error);
    throw error;
  }
};


export const getReservationById = async (id: number): Promise<Reservation> => {
  try {
    const response = await api.get(`/location/reservation/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la réservation ${id} :`, error);
    throw error;
  }
};


export const getReservationsWithFilters = async (filters: ReservationFilters): Promise<Reservation[]> => {
  try {
    const response = await api.get('location/reservation/filter', { params: filters });
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations avec filtres :", error);
    throw error;
  }
};

export const applyReservationReduction = async (id: number, percentage: number): Promise<Reservation> => {
  try {
    if (!isAuthenticated()) {
      throw new Error("Utilisateur non authentifié. Veuillez vous reconnecter.");
    }

    const response = await api.put(`location/reservation/reduction?id=${id}&pourcentage=${percentage}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Erreur lors de l'application de la réduction :", error);
    
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