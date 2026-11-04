import React, { createContext, useContext, useEffect, useState } from "react";
import { Enfant, EnfantPayload } from "../types/enfantType";
import {
  createEnfant,
  updateEnfant,
  formatEnfantData,
  getEnfants,
} from "../components/Api/enfantsService"; // ✅ on utilise TON service

type EnfantContextType = {
  enfants: Enfant[];
  loadingEnfant: boolean;
  errorEnfant: string | null;
  refreshEnfants: () => void;
  addEnfant: (data: EnfantPayload, file?: File) => Promise<void>;
  updateEnfantData: (id: number, data: EnfantPayload) => Promise<void>;
  formatEnfantData: (data: any) => EnfantPayload;
};

const EnfantContext = createContext<EnfantContextType | undefined>(undefined);

export const EnfantProvider = ({ children }: { children: React.ReactNode }) => {
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [loadingEnfant, setLoadingEnfant] = useState<boolean>(true);
  const [errorEnfant, setErrorEnfant] = useState<string | null>(null);

  // 🔁 Charger tous les enfants
  const fetchEnfants = async () => {
    try {
      setLoadingEnfant(true);
      const data = await getEnfants();
      setEnfants(data);
      setErrorEnfant(null);
    } catch (err: any) {
      console.error("Erreur lors du chargement des enfants :", err);
      setErrorEnfant(err.message || "Erreur de chargement des enfants.");
    } finally {
      setLoadingEnfant(false);
    }
  };

  // ➕ Ajouter un enfant
  const addEnfant = async (data: EnfantPayload, file?: File) => {
    try {
      await createEnfant(data, file);
      await fetchEnfants();
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'enfant :", err);
      throw err;
    }
  };

  // 🔄 Mettre à jour un enfant
  const updateEnfantData = async (id: number, data: EnfantPayload) => {
    try {
      await updateEnfant(id, data);
      await fetchEnfants();
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'enfant :", err);
      throw err;
    }
  };

  // 🧩 Formater les données d'un enfant (utile pour les formulaires)
  const handleFormatEnfantData = (data: any): EnfantPayload => {
    return formatEnfantData(data);
  };

  // ⚙️ Charger les enfants au montage
  useEffect(() => {
    fetchEnfants();
  }, []);

  return (
    <EnfantContext.Provider
      value={{
        enfants,
        loadingEnfant,
        errorEnfant,
        refreshEnfants: fetchEnfants,
        addEnfant,
        updateEnfantData,
        formatEnfantData: handleFormatEnfantData,
      }}
    >
      {children}
    </EnfantContext.Provider>
  );
};

// ✅ Hook personnalisé
export const useEnfantContext = () => {
  const context = useContext(EnfantContext);
  if (!context) {
    throw new Error("useEnfantContext doit être utilisé dans un EnfantProvider");
  }
  return context;
};
