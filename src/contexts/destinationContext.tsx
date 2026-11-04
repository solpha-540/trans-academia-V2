import React, { createContext, useContext, useEffect, useState } from "react";
import { Destination, DestinationPayload } from "../types/destinationType";
import { getDestinations, createDestination } from "../components/Api/destinationService";
import { toast } from "react-toastify";

type DestinationContextType = {
  destinations: Destination[];
  loadingDestination: boolean;
  errorDestination: string | null;
  refreshDestinations: () => void;
  createNewDestination: (payload: DestinationPayload) => Promise<void>;
  creatingDestination: boolean;
  createError: string | null;
};

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

export const DestinationProvider = ({ children }: { children: React.ReactNode }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestination, setLoading] = useState<boolean>(true);
  const [errorDestination, setErrorDestination] = useState<string | null>(null);
  const [creatingDestination, setCreatingDestination] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setErrorDestination(null);
      const data = await getDestinations();
      setDestinations(data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur de chargement des destinations.";
      setErrorDestination(errorMessage);
      console.error("Erreur lors du chargement des destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const createNewDestination = async (payload: DestinationPayload) => {
    try {
      setCreatingDestination(true);
      setCreateError(null);
      await createDestination(payload);
      // Recharger la liste après création
      await fetchDestinations();
      toast.success("Destination créée avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la création de la destination.";
      setCreateError(errorMessage);
      toast.error(errorMessage);
      console.error("Erreur lors de la création de la destination:", err);
      throw err;
    } finally {
      setCreatingDestination(false);
    }
  };

  return (
    <DestinationContext.Provider
      value={{
        destinations,
        loadingDestination,
        errorDestination,
        refreshDestinations: fetchDestinations,
        createNewDestination,
        creatingDestination,
        createError,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestinationContext = () => {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error("useDestinationContext doit être utilisé dans un DestinationProvider");
  }
  return context;
};