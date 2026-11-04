import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  Bus, 
  BusPayload,  // ← Utiliser BusPayload au lieu de Omit<Bus, ...>
  BusBreakdownLog, 
  BusBreakdownByLineResponse, 
  AffectationHistoryResponse,
  AffectationHistoryParams,
  BusReparationsResponse 
} from "../types/busType";
import { 
  getBus, 
  createBus, 
  updateBusStatus, 
  fetchBusForOperation,
  getBusBreakdowns,
  getBusBreakdownsByLineAndDate,
  getAffectationHistory,
  getBusReparationsByPeriod
} from "../components/Api/busService";

interface BusContextType {
  bus: Bus[];
  loadingBus: boolean;
  errorBus: string | null;
  refreshBus: () => void;
  addBus: (payload: BusPayload) => Promise<void>;  // ← Changé ici
  getBusForOperation: (busId: number) => Promise<any>;
  updateBusStatus: (busId: number, status: string) => Promise<void>;
  getBusBreakdowns: (busId: number) => Promise<BusBreakdownLog[]>;
  getBusBreakdownsByLineAndDate: (
    id_bus: number, 
    id_ligne: number, 
    date_debut: string, 
    date_fin: string
  ) => Promise<BusBreakdownByLineResponse>;
  getAffectationHistory: (params?: AffectationHistoryParams) => Promise<AffectationHistoryResponse>;
  getBusReparationsByPeriod: (
    id_bus: number,
    date_debut: string,
    date_fin: string
  ) => Promise<BusReparationsResponse>;
}

const BusContext = createContext<BusContextType | undefined>(undefined);

export const BusProvider = ({ children }: { children: React.ReactNode }) => {
  const [bus, setBus] = useState<Bus[]>([]);
  const [loadingBus, setLoading] = useState<boolean>(true);
  const [errorBus, setErrorBus] = useState<string | null>(null);

  const fetchBus = async () => {
    try {
      setLoading(true);
      const data = await getBus();
      setBus(data);
      setErrorBus(null);
    } catch (err) {
      setErrorBus("Erreur de chargement des bus.");
    } finally {
      setLoading(false);
    }
  };

  // ← Utiliser BusPayload ici aussi
  const addBus = async (payload: BusPayload) => {
    try {
      setLoading(true);
      await createBus(payload);
      await fetchBus();
    } catch (err) {
      setErrorBus("Erreur lors de la création du bus.");
      throw err;  // ← Important pour que le formulaire puisse capturer l'erreur
    } finally {
      setLoading(false);
    }
  };

  const getBusForOperationHandler = async (busId: number) => {
    try {
      return await fetchBusForOperation(busId);
    } catch (err) {
      console.error("Erreur lors de la récupération des infos opération :", err);
      throw err;
    }
  };

  const updateBusStatusHandler = async (busId: number, status: string) => {
    try {
      setLoading(true);
      
      await updateBusStatus(busId, status);
      
      let newDisponibilite = 0;
      
      if (status === 'VALIDATED' || status === 'VALIDE' || status === 'DISPONIBLE') {
        newDisponibilite = 1;
      } else if (status === 'EN REPARATION' || status === 'MAINTENANCE') {
        newDisponibilite = 2;
      } else if (status === 'NON TRAITER' || status === 'PENDING') {
        newDisponibilite = 0;
      }
      
      setBus(prev => prev.map(b => 
        b.id === busId ? { 
          ...b, 
          status,
          disponibilite: newDisponibilite
        } : b
      ));
      
      await fetchBus();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBusBreakdownsHandler = async (busId: number): Promise<BusBreakdownLog[]> => {
    try {
      setLoading(true);
      const response = await getBusBreakdowns(busId);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la récupération de l'historique des pannes :", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBusBreakdownsByLineAndDateHandler = async (
    id_bus: number, 
    id_ligne: number, 
    date_debut: string, 
    date_fin: string
  ): Promise<BusBreakdownByLineResponse> => {
    try {
      setLoading(true);
      const response = await getBusBreakdownsByLineAndDate(
        id_bus, 
        id_ligne, 
        date_debut, 
        date_fin
      );
      return response;
    } catch (err) {
      console.error("Erreur lors de la récupération des pannes par ligne et date :", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAffectationHistoryHandler = async (
    params?: AffectationHistoryParams
  ): Promise<AffectationHistoryResponse> => {
    try {
      setLoading(true);
      const response = await getAffectationHistory(params);
      return response;
    } catch (err) {
      console.error("Erreur lors de la récupération de l'historique des affectations :", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBusReparationsByPeriodHandler = async (
    id_bus: number,
    date_debut: string,
    date_fin: string
  ): Promise<BusReparationsResponse> => {
    try {
      setLoading(true);
      const response = await getBusReparationsByPeriod(id_bus, date_debut, date_fin);
      return response;
    } catch (err) {
      console.error("Erreur lors de la récupération des réparations du bus :", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBus();
  }, []);

  return (
    <BusContext.Provider
      value={{
        bus,
        loadingBus,
        errorBus,
        refreshBus: fetchBus,
        addBus,
        getBusForOperation: getBusForOperationHandler,
        updateBusStatus: updateBusStatusHandler,
        getBusBreakdowns: getBusBreakdownsHandler,
        getBusBreakdownsByLineAndDate: getBusBreakdownsByLineAndDateHandler,
        getAffectationHistory: getAffectationHistoryHandler,
        getBusReparationsByPeriod: getBusReparationsByPeriodHandler,
      }}
    >
      {children}
    </BusContext.Provider>
  );
};

export const useBusContext = () => {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error("useBusContext doit être utilisé dans un BusProvider");
  }
  return context;
};