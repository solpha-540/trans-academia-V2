import React, { createContext, useContext, useState } from "react";
import {
  getAptitudesPhysiques,
  createAptitudePhysique,
  updateAptitudePhysique,
} from "../components/Api/aptitudePhysiqueService";
import { AptitudePhysique, AptitudePhysiquePayload, UpdateAptitudeData } from "../types/aptitudePhysiqueType";

interface AptitudeContextType {
  aptitudes: AptitudePhysique[];
  fetchAptitudes: () => Promise<void>;
  addAptitude: (data: AptitudePhysiquePayload) => Promise<void>;
  updateAptitude: (id: number, data: UpdateAptitudeData) => Promise<UpdateAptitudeData>;
}

const AptitudeContext = createContext<AptitudeContextType | undefined>(undefined);

export const AptitudeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aptitudes, setAptitudes] = useState<AptitudePhysique[]>([]);

  const fetchAptitudes = async () => {
    const data = await getAptitudesPhysiques();
    setAptitudes(data);
  };

  const addAptitude = async (payload: AptitudePhysiquePayload) => {
    const newApt = await createAptitudePhysique(payload);
    setAptitudes((prev) => [...prev, newApt]);
  };

  const updateAptitude = async (aptitudeId: number, data: UpdateAptitudeData): Promise<UpdateAptitudeData>  => {
    try {
      const updated = await updateAptitudePhysique(aptitudeId, data);
      setAptitudes((prev) =>
        prev.map((item) => (item.id === aptitudeId ? updated : item))
      );
      return updated;
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  };
  

  return (
    <AptitudeContext.Provider
      value={{ aptitudes, fetchAptitudes, addAptitude, updateAptitude }}
    >
      {children}
    </AptitudeContext.Provider>
  );
};

export const useAptitudePhysiqueContext = () => {
  const context = useContext(AptitudeContext);
  if (!context) {
    throw new Error("useAptitudeContext doit être utilisé dans un AptitudeProvider");
  }
  return context;
};

