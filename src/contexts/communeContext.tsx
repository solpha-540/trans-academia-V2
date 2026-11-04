import React, { createContext, useContext, useEffect, useState } from "react";
import { Commune, CommunePayload } from "../types/communeType";
import {
  createCommune,
  deleteCommune,
  getCommunes,
  updateCommune,
} from "../components/Api/communeService";

type CommuneContextType = {
  communes: Commune[];
  loadingCommune: boolean;
  errorCommune: string | null;
  refreshCommunes: () => void;
  createNewCommune: (payload: CommunePayload) => Promise<void>;
  creatingCommune: boolean; // Ajout pour le loading de création
  createError: string | null; // Ajout pour l'erreur de création
  updateCommuneData: (id: number, payload: { labele: string; Id_ville: number; created_by_user: string }) => Promise<void>;
  deleteCommuneData: (id: number) => Promise<void>;
};

const CommuneContext = createContext<CommuneContextType | undefined>(undefined);

export const CommuneProvider = ({ children }: { children: React.ReactNode }) => {
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loadingCommune, setLoading] = useState<boolean>(true);
  const [errorCommune, setErrorCommune] = useState<string | null>(null);
  const [creatingCommune, setCreatingCommune] = useState<boolean>(false); // État pour la création
  const [createError, setCreateError] = useState<string | null>(null); // Erreur de création

  const fetchCommunes = async () => {
    try {
      setLoading(true);
      setErrorCommune(null);
      const data = await getCommunes();
      setCommunes(data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur de chargement des communes.";
      setErrorCommune(errorMessage);
      console.error("Erreur lors du chargement des communes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunes();
  }, []);

  const createNewCommune = async (payload: CommunePayload) => {
    try {
      setCreatingCommune(true);
      setCreateError(null);
      await createCommune(payload);
      await fetchCommunes(); // Recharger la liste après création
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur lors de la création de la commune.";
      setCreateError(errorMessage);
      console.error("Erreur lors de la création de la commune:", err);
      throw err; // Propager l'erreur pour la gérer dans le composant
    } finally {
      setCreatingCommune(false);
    }
  };

  const updateCommuneData = async (
    id: number,
    payload: { labele: string; Id_ville: number; created_by_user: string }
  ) => {
    await updateCommune(id, payload);
    await fetchCommunes();
  };

  const deleteCommuneData = async (id: number) => {
    await deleteCommune(id);
    await fetchCommunes();
  };

  return (
    <CommuneContext.Provider
      value={{
        communes,
        loadingCommune,
        errorCommune,
        refreshCommunes: fetchCommunes,
        createNewCommune,
        creatingCommune, // Ajouté
        createError, // Ajouté
        updateCommuneData,
        deleteCommuneData,
      }}
    >
      {children}
    </CommuneContext.Provider>
  );
};

export const useCommuneContext = () => {
  const context = useContext(CommuneContext);
  if (!context) {
    throw new Error("useCommuneContext doit être utilisé dans un CommuneProvider");
  }
  return context;
};