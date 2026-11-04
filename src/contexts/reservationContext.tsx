// contexts/reservationContext.tsx
// contexts/reservationContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Reservation, ReservationPayload, ReservationFilters } from "../types/reservationType";
import { 
  getAllReservations, 
  createReservation, 
  updateReservation, 
  deleteReservation, 
  getReservationById, 
  getReservationsWithFilters,
  addPaymentProof as addPaymentProofService,
  updateReservationStatus as updateReservationStatusService,
  applyReservationReduction
} from "../components/Api/reservationService";
import { toast } from "react-toastify";

type ReservationContextType = {
  // États des réservations
  reservations: Reservation[];
  loadingReservations: boolean;
  errorReservations: string | null;
  
  // États des opérations
  creatingReservation: boolean;
  updatingReservation: boolean;
  deletingReservation: boolean;
  addingPaymentProof: boolean;
  updatingStatus: boolean;
  
  // États d'erreur
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  paymentProofError: string | null;
  updateStatusError: string | null;
  
  // Fonctions principales
  refreshReservations: () => void;
  createNewReservation: (payload: ReservationPayload) => Promise<void>;
  updateExistingReservation: (id: number, payload: Partial<ReservationPayload>) => Promise<void>;
  deleteExistingReservation: (id: number) => Promise<void>;
  getReservationByIdContext: (id: number) => Promise<Reservation>;
  getReservationsWithFiltersContext: (filters: ReservationFilters) => Promise<Reservation[]>;
  
  // Fonction pour la preuve de paiement
  addPaymentProof: (reservationId: number, file: File) => Promise<void>;
  
  // Fonction pour mettre à jour le statut
  updateReservationStatus: (id: number, status: string) => Promise<void>;
  
  // Fonction pour appliquer une réduction
  applyingReduction: boolean;
  applyReductionError: string | null;
  applyReduction: (id: number, percentage: number) => Promise<void>;
  
  // Statistiques et utilitaires
  reservationStats: {
    total: number;
    confirmed: number;
    pending: number;
    canceled: number;
    withCatering: number;
  };
};

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider = ({ children }: { children: React.ReactNode }) => {
  // États des données
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState<boolean>(true);
  const [errorReservations, setErrorReservations] = useState<string | null>(null);
  
  // États des opérations
  const [creatingReservation, setCreatingReservation] = useState<boolean>(false);
  const [updatingReservation, setUpdatingReservation] = useState<boolean>(false);
  const [deletingReservation, setDeletingReservation] = useState<boolean>(false);
  const [addingPaymentProof, setAddingPaymentProof] = useState<boolean>(false);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  
  // États d'erreur
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [paymentProofError, setPaymentProofError] = useState<string | null>(null);
  const [updateStatusError, setUpdateStatusError] = useState<string | null>(null);
  const [applyingReduction, setApplyingReduction] = useState<boolean>(false);
  const [applyReductionError, setApplyReductionError] = useState<string | null>(null);

  // Calcul des statistiques
  const reservationStats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    canceled: reservations.filter(r => r.status === 'canceled').length,
    withCatering: reservations.filter(r => r.is_collation).length,
  };

  // Fonction pour charger les réservations
  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      setErrorReservations(null);
      const data = await getAllReservations();
      setReservations(data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur de chargement des réservations.";
      setErrorReservations(errorMessage);
      console.error("Erreur lors du chargement des réservations:", err);
    } finally {
      setLoadingReservations(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchReservations();
  }, []);

  // Création d'une réservation
  const createNewReservation = async (payload: ReservationPayload) => {
    try {
      setCreatingReservation(true);
      setCreateError(null);
      await createReservation(payload);
      await fetchReservations();
      toast.success("Réservation créée avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la création de la réservation.";
      setCreateError(errorMessage);
      toast.error(errorMessage);
      console.error("Erreur lors de la création de la réservation:", err);
      throw err;
    } finally {
      setCreatingReservation(false);
    }
  };

  // Mise à jour d'une réservation
  const updateExistingReservation = async (id: number, payload: Partial<ReservationPayload>) => {
    try {
      setUpdatingReservation(true);
      setUpdateError(null);
      await updateReservation(id, payload);
      await fetchReservations();
      toast.success("Réservation mise à jour avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la mise à jour de la réservation.";
      setUpdateError(errorMessage);
      toast.error(errorMessage);
      console.error("Erreur lors de la mise à jour de la réservation:", err);
      throw err;
    } finally {
      setUpdatingReservation(false);
    }
  };

  // Mise à jour du statut d'une réservation
  const updateReservationStatus = async (id: number, status: string) => {
    try {
      setUpdatingStatus(true);
      setUpdateStatusError(null);
      
      // Mettre à jour le statut via le service
      const updatedReservation = await updateReservationStatusService(id, status);
      
      // Mettre à jour la liste des réservations
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation.id === id ? updatedReservation : reservation
        )
      );
      
      toast.success("Statut de la réservation mis à jour avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      setUpdateStatusError(error.message || "Erreur lors de la mise à jour du statut");
      toast.error(error.message || "Erreur lors de la mise à jour du statut");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Fonction pour appliquer une réduction à une réservation
  const applyReduction = async (id: number, percentage: number) => {
    try {
      setApplyingReduction(true);
      setApplyReductionError(null);
      
      // Appliquer la réduction via le service
      const updatedReservation = await applyReservationReduction(id, percentage);
      
      // Mettre à jour la liste des réservations
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation.id === id ? updatedReservation : reservation
        )
      );
      
      toast.success(`Réduction de ${percentage * 100}% appliquée avec succès`);
    } catch (error: any) {
      console.error("Erreur lors de l'application de la réduction :", error);
      setApplyReductionError(error.message || "Erreur lors de l'application de la réduction");
      toast.error(error.message || "Erreur lors de l'application de la réduction");
    } finally {
      setApplyingReduction(false);
    }
  };

  // Suppression d'une réservation
  const deleteExistingReservation = async (id: number) => {
    try {
      setDeletingReservation(true);
      setDeleteError(null);
      await deleteReservation(id);
      await fetchReservations();
      toast.success("Réservation supprimée avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la suppression de la réservation.";
      setDeleteError(errorMessage);
      toast.error(errorMessage);
      console.error("Erreur lors de la suppression de la réservation:", err);
      throw err;
    } finally {
      setDeletingReservation(false);
    }
  };

  // Récupération d'une réservation par ID
  const getReservationByIdContext = async (id: number): Promise<Reservation> => {
    try {
      console.log(`🟢 getReservationByIdContext appelée avec l'ID: ${id}`);
      const reservation = await getReservationById(id);
      console.log(`✅ Données reçues pour la réservation ${id}:`, reservation);
      return reservation;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur lors de la récupération de la réservation.";
      console.error(`❌ Erreur dans getReservationByIdContext pour l'ID ${id}:`, err);
      throw new Error(errorMessage);
    }
  };

  // Filtrage des réservations
  const getReservationsWithFiltersContext = async (filters: ReservationFilters): Promise<Reservation[]> => {
    try {
      return await getReservationsWithFilters(filters);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur lors du filtrage des réservations.";
      console.error("Erreur lors du filtrage des réservations:", err);
      throw new Error(errorMessage);
    }
  };

  // Ajout d'une preuve de paiement
  const addPaymentProof = async (reservationId: number, file: File): Promise<void> => {
    try {
      setAddingPaymentProof(true);
      setPaymentProofError(null);
      await addPaymentProofService(reservationId, file);
      await fetchReservations(); // Rafraîchir la liste
      toast.success("Preuve de paiement ajoutée avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de l'ajout de la preuve de paiement.";
      setPaymentProofError(errorMessage);
      toast.error(errorMessage);
      console.error("Erreur lors de l'ajout de la preuve de paiement:", err);
      throw err;
    } finally {
      setAddingPaymentProof(false);
    }
  };

  // Valeur du contexte
  const contextValue: ReservationContextType = {
    // États des données
    reservations,
    loadingReservations,
    errorReservations,
    
    // États des opérations
    creatingReservation,
    updatingReservation,
    deletingReservation,
    addingPaymentProof,
    updatingStatus,
    applyingReduction,
    
    // États d'erreur
    createError,
    updateError,
    deleteError,
    paymentProofError,
    updateStatusError,
    applyReductionError,
    
    // Fonctions principales
    refreshReservations: fetchReservations,
    createNewReservation,
    updateExistingReservation,
    deleteExistingReservation,
    getReservationByIdContext,
    getReservationsWithFiltersContext,
    
    // Fonction pour la preuve de paiement
    addPaymentProof,
    
    // Fonction pour mettre à jour le statut
    updateReservationStatus,
    
    // Fonction pour appliquer une réduction
    applyReduction,
    
    // Statistiques
    reservationStats,
  };

  return (
    <ReservationContext.Provider value={contextValue}>
      {children}
    </ReservationContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useReservationContext = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservationContext doit être utilisé dans un ReservationProvider");
  }
  return context;
};