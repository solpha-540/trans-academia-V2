import React, { createContext, useContext, useEffect, useState } from "react";
import { Grade, GradePayload } from "../types/gradeType";
import { createGrade, deleteGrade, getGrades, updateGrade } from "../components/Api/gradeService";

type GradeContextType = {
    grades: Grade[];
    loading: boolean;
    error: string | null;
    refreshGrades: () => void;
    addGrade: (data: GradePayload) => Promise<void>; // Utilise le type importé
    updateGradeData: (id: number, payload: { libelle: string }) => Promise<void>;
    deleteGradeData: (id: number) => Promise<void>;
  };

const GradeContext = createContext<GradeContextType | undefined>(undefined);

export const GradeProvider = ({ children }: { children: React.ReactNode }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await getGrades();
      setGrades(data);
      setError(null);
    } catch {
      setError("Erreur de chargement des grades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const addGrade = async (data: GradePayload) => {
    await createGrade(data);
    await fetchGrades();
  };

  const updateGradeData = async (id: number, payload: { libelle: string }) => {
    try {
      setLoading(true);
      await updateGrade(id, payload);
      await fetchGrades();
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la mise à jour du grade.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGradeData = async (id: number) => {
    try {
      setLoading(true);
      await deleteGrade(id);
      await fetchGrades();
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la suppression du grade.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradeContext.Provider
      value={{
        grades,
        loading,
        error,
        refreshGrades: fetchGrades,
        addGrade,
        updateGradeData,
        deleteGradeData,
      }}
    >
      {children}
    </GradeContext.Provider>
  );
};

export const useGradeContext = () => {
  const context = useContext(GradeContext);
  if (!context) {
    throw new Error("useGradeContext doit être utilisé dans un GradeProvider");
  }
  return context;
};
