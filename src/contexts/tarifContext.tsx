import React, { createContext, useContext, useEffect, useState } from "react";
import { Tarif, TarifPayload } from "../types/tarifsType";
import { getTarifs, createTarif, getTarifsByBusLocation, getTarifsByDestination } from "../components/Api/tarifService";
import { toast } from "react-toastify";

type TarifContextType = {
    tarifs: Tarif[];
    loadingTarif: boolean;
    errorTarif: string | null;
    refreshTarifs: (bus_location_id?: number) => void;
    createNewTarif: (payload: TarifPayload) => Promise<void>;
    creatingTarif: boolean;
    createError: string | null;
    getTarifsForBusLocation: (bus_location_id: number) => Promise<Tarif[]>;
    getTarifsForDestination: (destination_id: number) => Promise<Tarif[]>;
  };

const TarifContext = createContext<TarifContextType | undefined>(undefined);

export const TarifProvider = ({ children }: { children: React.ReactNode }) => {
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [loadingTarif, setLoading] = useState<boolean>(true);
  const [errorTarif, setErrorTarif] = useState<string | null>(null);
  const [creatingTarif, setCreatingTarif] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchTarifs = async (bus_location_id?: number) => {
    try {
      setLoading(true);
      setErrorTarif(null);
      const data = await getTarifs(bus_location_id);
      setTarifs(data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur de chargement des tarifs.";
      setErrorTarif(errorMessage);
      console.error("Erreur lors du chargement des tarifs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarifs();
  }, []);

  const createNewTarif = async (payload: TarifPayload) => {
    try {
      setCreatingTarif(true);
      setCreateError(null);
      await createTarif(payload);
      // Recharger la liste après création
      await fetchTarifs();
      toast.success("Tarif créé avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la création du tarif.";
      setCreateError(errorMessage);
      toast.error(errorMessage);
      console.error("Erreur lors de la création du tarif:", err);
      throw err;
    } finally {
      setCreatingTarif(false);
    }
  };

  const getTarifsForBusLocation = async (bus_location_id: number): Promise<Tarif[]> => {
    try {
      return await getTarifsByBusLocation(bus_location_id);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur de chargement des tarifs pour cet emplacement de bus.";
      console.error("Erreur lors du chargement des tarifs pour l'emplacement de bus:", err);
      throw new Error(errorMessage);
    }
  };

  const getTarifsForDestination = async (destination_id: number): Promise<Tarif[]> => {
    try {
      return await getTarifsByDestination(destination_id);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur de chargement des tarifs pour cette destination.";
      console.error("Erreur lors du chargement des tarifs pour la destination:", err);
      throw new Error(errorMessage);
    }
  };

  return (
    <TarifContext.Provider
      value={{
        tarifs,
        loadingTarif,
        errorTarif,
        refreshTarifs: fetchTarifs,
        createNewTarif,
        creatingTarif,
        createError,
        getTarifsForBusLocation,
        getTarifsForDestination,
      }}
    >
      {children}
    </TarifContext.Provider>
  );
};

export const useTarifContext = () => {
  const context = useContext(TarifContext);
  if (!context) {
    throw new Error("useTarifContext doit être utilisé dans un TarifProvider");
  }
  return context;
};