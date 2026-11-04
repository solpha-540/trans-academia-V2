import React, { createContext, useContext, useEffect, useState } from "react";
import { Service, ServiceBusBreakdown } from "../types/serviceType"; // Import depuis serviceType.ts
import { 
  deleteService, 
  getServices, 
  updateService,
  getBusBreakdownsByService
} from "../components/Api/serviceService";

type ServiceContextType = {
  services: Service[];
  loading: boolean;
  error: string | null;
  refreshServices: () => void;
  updateServiceData: (id: number, payload: { libelle: string }) => Promise<void>;
  deleteServiceData: (id: number) => Promise<void>;
  // Nouvelles propriétés pour les statistiques des pannes
  busBreakdowns: ServiceBusBreakdown[] | null;
  breakdownStatsLoading: boolean;
  breakdownStatsError: string | null;
  fetchBusBreakdownStats: (serviceId: number, dateDebut: string, dateFin: string) => Promise<void>;
  clearBreakdownStats: () => void;
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Nouveau state pour les statistiques des pannes
  const [busBreakdowns, setBusBreakdowns] = useState<ServiceBusBreakdown[] | null>(null);
  const [breakdownStatsLoading, setBreakdownStatsLoading] = useState<boolean>(false);
  const [breakdownStatsError, setBreakdownStatsError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
      setError(null);
    } catch (err: any) {
      setError("Erreur de chargement des services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const updateServiceData = async (id: number, payload: { libelle: string }) => {
    try {
      setLoading(true);
      await updateService(id, payload);
      await fetchServices();
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la mise à jour du service.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteServiceData = async (id: number) => {
    try {
      setLoading(true);
      await deleteService(id);
      await fetchServices();
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la suppression du service.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Nouvelle fonction pour récupérer les statistiques des pannes
  const fetchBusBreakdownStats = async (serviceId: number, dateDebut: string, dateFin: string) => {
    try {
      setBreakdownStatsLoading(true);
      setBreakdownStatsError(null);
      const stats = await getBusBreakdownsByService(serviceId, dateDebut, dateFin);
      setBusBreakdowns(stats);
    } catch (err: any) {
      setBreakdownStatsError(err?.message || "Erreur lors de la récupération des statistiques de pannes.");
      setBusBreakdowns(null);
      throw err;
    } finally {
      setBreakdownStatsLoading(false);
    }
  };

  const clearBreakdownStats = () => {
    setBusBreakdowns(null);
    setBreakdownStatsError(null);
    setBreakdownStatsLoading(false);
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        loading,
        error,
        refreshServices: fetchServices,
        updateServiceData,
        deleteServiceData,
        // Nouvelles valeurs
        busBreakdowns,
        breakdownStatsLoading,
        breakdownStatsError,
        fetchBusBreakdownStats,
        clearBreakdownStats,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

// Hook personnalisé
export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServiceContext doit être utilisé dans un ServiceProvider");
  }
  return context;
};