import React, { createContext, useContext, useEffect, useState } from "react";
import { Collation, CollationPayload } from "../types/collationType";
import { getAllCollations, createCollation, updateCollation, deleteCollation, getCollationsByBus } from "../components/Api/collationService";
import { toast } from "react-toastify";

type CollationContextType = {
  collations: Collation[];
  loadingCollations: boolean;
  errorCollations: string | null;
  refreshCollations: () => void;
  createNewCollation: (payload: CollationPayload) => Promise<void>;
  updateExistingCollation: (id: number, payload: Partial<CollationPayload>) => Promise<void>;
  deleteExistingCollation: (id: number) => Promise<void>;
  getCollationsForBus: (bus_location_id: number) => Promise<Collation[]>;
  creatingCollation: boolean;
  createError: string | null;
};

const CollationContext = createContext<CollationContextType | undefined>(undefined);

export const CollationProvider = ({ children }: { children: React.ReactNode }) => {
  const [collations, setCollations] = useState<Collation[]>([]);
  const [loadingCollations, setLoadingCollations] = useState<boolean>(true);
  const [errorCollations, setErrorCollations] = useState<string | null>(null);
  const [creatingCollation, setCreatingCollation] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchCollations = async () => {
    try {
      setLoadingCollations(true);
      setErrorCollations(null);
      const data = await getAllCollations();
      setCollations(data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur de chargement des collations.";
      setErrorCollations(errorMessage);
      console.error("Erreur lors du chargement des collations:", err);
    } finally {
      setLoadingCollations(false);
    }
  };

  useEffect(() => {
    fetchCollations();
  }, []);

  const createNewCollation = async (payload: CollationPayload) => {
    try {
      setCreatingCollation(true);
      setCreateError(null);
      await createCollation(payload);
      await fetchCollations();
      toast.success("Collation créée avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la création de la collation.";
      setCreateError(errorMessage);
      toast.error(errorMessage);
      console.error("Erreur lors de la création de la collation:", err);
      throw err;
    } finally {
      setCreatingCollation(false);
    }
  };

  const updateExistingCollation = async (id: number, payload: Partial<CollationPayload>) => {
    try {
      setCreatingCollation(true);
      await updateCollation(id, payload);
      await fetchCollations();
      toast.success("Collation mise à jour avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la mise à jour de la collation.";
      toast.error(errorMessage);
      console.error("Erreur lors de la mise à jour de la collation:", err);
      throw err;
    } finally {
      setCreatingCollation(false);
    }
  };

  const deleteExistingCollation = async (id: number) => {
    try {
      setCreatingCollation(true);
      await deleteCollation(id);
      await fetchCollations();
      toast.success("Collation supprimée avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la suppression de la collation.";
      toast.error(errorMessage);
      console.error("Erreur lors de la suppression de la collation:", err);
      throw err;
    } finally {
      setCreatingCollation(false);
    }
  };

  const getCollationsForBus = async (bus_location_id: number): Promise<Collation[]> => {
    try {
      return await getCollationsByBus(bus_location_id);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur de chargement des collations pour ce bus.";
      console.error("Erreur lors du chargement des collations pour le bus:", err);
      throw new Error(errorMessage);
    }
  };

  return (
    <CollationContext.Provider
      value={{
        collations,
        loadingCollations,
        errorCollations,
        refreshCollations: fetchCollations,
        createNewCollation,
        updateExistingCollation,
        deleteExistingCollation,
        getCollationsForBus,
        creatingCollation,
        createError,
      }}
    >
      {children}
    </CollationContext.Provider>
  );
};

export const useCollationContext = () => {
  const context = useContext(CollationContext);
  if (!context) {
    throw new Error("useCollationContext doit être utilisé dans un CollationProvider");
  }
  return context;
};