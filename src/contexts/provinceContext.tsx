
import React, { createContext, useContext, useEffect, useState } from "react";
import { Province, ProvincePayload } from "../types/provinceType"; // <-- assure-toi que ce fichier existe
import {
  createProvince,
  deleteProvince,
  getProvinces,
  updateProvince,
} from "../components/Api/provinceService";

type ProvinceContextType = {
  provinces: Province[];
  loading: boolean;
  error: string | null;
  refreshProvinces: () => void;
  addProvince: (data: ProvincePayload) => Promise<void>;
  updateProvinceData: (id: number, data: { labele: string; code_province: string }) => Promise<void>;
  deleteProvinceData: (id: number) => Promise<void>;
};

const ProvinceContext = createContext<ProvinceContextType | undefined>(undefined);

export const ProvinceProvider = ({ children }: { children: React.ReactNode }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const data = await getProvinces();
      setProvinces(data);
      setError(null);
    } catch {
      setError("Erreur de chargement des provinces.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const addProvince = async (data: ProvincePayload) => {
    await createProvince(data);
    await fetchProvinces();
  };

  const updateProvinceData = async (
    id: number,
    data: { labele: string; code_province: string }
  ) => {
    await updateProvince(id, data);
    await fetchProvinces();
  };

  const deleteProvinceData = async (id: number) => {
    await deleteProvince(id);
    await fetchProvinces();
  };

  return (
    <ProvinceContext.Provider
      value={{
        provinces,
        loading,
        error,
        refreshProvinces: fetchProvinces,
        addProvince,
        updateProvinceData,
        deleteProvinceData,
      }}
    >
      {children}
    </ProvinceContext.Provider>
  );
};

export const useProvinceContext = () => {
  const context = useContext(ProvinceContext);
  if (!context) {
    throw new Error("useProvinceContext doit être utilisé dans un ProvinceProvider");
  }
  return context;
};
