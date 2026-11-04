import React, { createContext, useContext, useEffect, useState } from "react";
import { Ville, VillePayload } from "../types/villeType";
import {
  createVille as apiCreateVille,
  deleteVille,
  getVilles,
  updateVille,
} from "../components/Api/villeService";

type VilleContextType = {
  villes: Ville[];
  loadingVille: boolean;
  errorVille: string | null;
  refreshVilles: () => void;
  createVille: (payload: VillePayload) => Promise<void>;
  updateVilleData: (id: number, payload: { labele: string; Id_province: number; CodeVille: string }) => Promise<void>;
  deleteVilleData: (id: number) => Promise<void>;
};

const VilleContext = createContext<VilleContextType | undefined>(undefined);

export const VilleProvider = ({ children }: { children: React.ReactNode }) => {
  const [villes, setVilles] = useState<Ville[]>([]);
  const [loadingVille, setLoading] = useState<boolean>(true);
  const [errorVille, setErrorVille] = useState<string | null>(null);

  const fetchVilles = async () => {
    try {
      setLoading(true);
      const data = await getVilles(); // ← appel à l'API
      setVilles(data);
      console.log( data)
      setErrorVille(null);
    } catch (err: any) {
      setErrorVille("Erreur de chargement des villes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVilles();
  }, []);

  const createVille = async (payload: VillePayload) => {
    await apiCreateVille(payload);
    await fetchVilles();
  };

  const updateVilleData = async (
    id: number,
    payload: { labele: string; Id_province: number; CodeVille: string }
  ) => {
    await updateVille(id, payload);
    await fetchVilles();
  };

  const deleteVilleData = async (id: number) => {
    await deleteVille(id);
    await fetchVilles();
  };

return (
  <VilleContext.Provider
    value={{
      villes,
      loadingVille,
      errorVille,
      refreshVilles: fetchVilles,
      createVille,
      updateVilleData,
      deleteVilleData,
    }}
  >
    {children}
  </VilleContext.Provider>
);
};

export const useVilleContext = () => {
  const context = useContext(VilleContext);
  if (!context) {
    throw new Error("useVilleContext doit être utilisé dans un VilleProvider");
  }
  return context;
};
