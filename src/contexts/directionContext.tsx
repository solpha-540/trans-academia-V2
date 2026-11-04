import React, { createContext, useContext, useEffect, useState } from "react";
import { Direction } from "../types/directionType";
import {
  createDirection as apiCreateDirection,
  deleteDirection,
  getDirections,
  updateDirection,
} from "../components/Api/directionService";

type DirectionContextType = {
  directions: Direction[];
  loading: boolean;
  error: string | null;
  refreshDirections: () => void;
  createDirection: (libele: string) => Promise<void>;
  updateDirectionData: (id: number, payload: { libele: string }) => Promise<void>;
  deleteDirectionData: (id: number) => Promise<void>;
};

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export const DirectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDirections = async () => {
    try {
      setLoading(true);
      const data = await getDirections();
      setDirections(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur de chargement des directions.");
    } finally {
      setLoading(false);
    }
  };

  const createDirection = async (libele: string) => {
    try {
      setLoading(true);
      await apiCreateDirection({ libele });
      await fetchDirections(); // Rafraîchir la liste
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de la direction.");
    } finally {
      setLoading(false);
    }
  };

  const updateDirectionData = async (id: number, payload: { libele: string }) => {
    try {
      setLoading(true);
      await updateDirection(id, payload);
      await fetchDirections();
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erreur lors de la mise à jour de la direction.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDirectionData = async (id: number) => {
    try {
      setLoading(true);
      await deleteDirection(id);
      await fetchDirections();
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erreur lors de la suppression de la direction.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirections();
  }, []);

  return (
    <DirectionContext.Provider
      value={{
        directions,
        loading,
        error,
        refreshDirections: fetchDirections,
        createDirection,
        updateDirectionData,
        deleteDirectionData,
      }}
    >
      {children}
    </DirectionContext.Provider>
  );
};

export const useDirectionContext = () => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error("useDirectionContext doit être utilisé dans un DirectionProvider");
  }
  return context;
};

