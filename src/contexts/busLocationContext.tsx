import React, { createContext, useContext, useEffect, useState } from "react";
import { BusLocation, BusLocationPayload, BusStatus, BusByLocationServiceResponse } from "../types/busLocationType";
import * as busLocationService from "../components/Api/busLocationService";

// Interface étendue pour inclure la nouvelle fonction
interface BusLocationContextType {
  busLocations: BusLocation[];
  loadingBusLocations: boolean;
  errorBusLocations: string | null;
  refreshBusLocations: () => void;
  addBusLocation: (payload: BusLocationPayload) => Promise<void>;
  updateBusLocation: (id: number, payload: Partial<BusLocationPayload>) => Promise<void>;
  deleteBusLocation: (id: number) => Promise<void>;
  getBusLocationById: (id: number) => Promise<BusLocation | null>;
  updateBusStatus: (busId: number, status: string, bus_reste: number) => Promise<void>;
  updateBusType: (busId: number, typeBus: string) => Promise<void>;
  getBusByLocationService: (id_service: number) => Promise<BusByLocationServiceResponse>;
  getBusReportsById: (busId: number) => Promise<any[]>;  // Nouvelle fonction pour récupérer les signalements d'un bus
}

const BusLocationContext = createContext<BusLocationContextType | undefined>(undefined);

export const BusLocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [loadingBusLocations, setLoading] = useState<boolean>(true);
  const [errorBusLocations, setErrorBusLocations] = useState<string | null>(null);

  const calculateStatus = (bus: BusLocation): BusStatus => {
    return bus.bus_reste > 0 ? 'disponible' : 'indisponible';
  };

  // Fonction pour mettre à jour le statut des bus basé sur bus_reste
  const updateBusStatuses = (buses: BusLocation[]): BusLocation[] => {
    return buses.map(bus => ({
      ...bus,
      status: calculateStatus(bus)
    }));
  };

  const fetchBusLocations = async () => {
    try {
      setLoading(true);
      const data = await busLocationService.getAllBusLocations();
      
      // Mettre à jour les statuts basés sur bus_reste
      const busesWithCorrectStatus = updateBusStatuses(data);
      setBusLocations(busesWithCorrectStatus);
      
      setErrorBusLocations(null);
    } catch (err) {
      setErrorBusLocations("Erreur de chargement des emplacements de bus.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addBusLocation = async (payload: BusLocationPayload) => {
    try {
      console.log('🚀 DEBUT - addBusLocation dans contexte');
      console.log('📦 Payload reçu:', payload);
      
      setLoading(true);
      console.log('📡 Appel de createBusLocation...');
      
      // Calculer le statut basé sur bus_reste avec le type correct
      const status: BusStatus = payload.bus_reste > 0 ? 'disponible' : 'indisponible';
      
      // Exclure id_user_created avant d'envoyer les données au service
      const { id_user_created, ...busData } = payload;
      const dataToSend = {
        ...busData,
        status: status // Maintenant c'est de type BusStatus
      };
      
      const result = await busLocationService.createBusLocation(dataToSend);
      
      console.log('✅ SUCCES - Bus créé:', result);
      console.log('🔄 Rafraîchissement des données...');
      await fetchBusLocations();
      
      console.log('🎉 FIN - addBusLocation terminé avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la création du bus:', {
        message: err?.message || 'Erreur inconnue',
        response: err?.response?.data,
        status: err?.response?.status
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBusLocationById = async (id: number, payload: Partial<BusLocationPayload>) => {
    try {
      setLoading(true);
      
      // Si bus_reste est modifié, recalculer le statut
      if (payload.bus_reste !== undefined) {
        const status = payload.bus_reste > 0 ? 'disponible' : 'indisponible';
        payload.status = status;
      }
      
      await busLocationService.updateBusLocation(id, payload);
      await fetchBusLocations();
    } catch (err) {
      setErrorBusLocations(`Erreur lors de la mise à jour de l'emplacement de bus ${id}.`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBusLocationById = async (id: number) => {
    try {
      setLoading(true);
      await busLocationService.deleteBusLocation(id);
      await fetchBusLocations();
    } catch (err) {
      setErrorBusLocations(`Erreur lors de la suppression de l'emplacement de bus ${id}.`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBusLocationByIdContext = async (id: number): Promise<BusLocation | null> => {
    try {
      const bus = await busLocationService.getBusLocationById(id);
      if (bus) {
        // S'assurer que le statut est cohérent avec bus_reste
        return {
          ...bus,
          status: calculateStatus(bus)
        };
      }
      return null;
    } catch (err) {
      console.error("Erreur lors de la récupération de l'emplacement de bus :", err);
      return null;
    }
  };

  // Mettre à jour le statut et le bus_reste d'un bus
  const updateBusStatus = async (busId: number, _status: string, bus_reste: number) => {
    try {
      console.log('🔄 CONTEXTE - Début updateBusStatus');
      setLoading(true);
      
      // Calculer le statut basé sur bus_reste (ignorer le statut passé en paramètre)
      const calculatedStatus = bus_reste > 0 ? 'disponible' : 'indisponible';
      
      await busLocationService.updateBusLocationStatus(busId, calculatedStatus, bus_reste);
      console.log('✅ CONTEXTE - Statut et bus_reste mis à jour, rafraîchissement des données...');
      await fetchBusLocations();
    } catch (err) {
      console.error('❌ CONTEXTE - Erreur updateBusStatus:', err);
      setErrorBusLocations(`Erreur lors de la mise à jour du statut du bus ${busId}.`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le type d'un bus
  const updateBusType = async (busId: number, typeBus: string) => {
    try {
      console.log('🔄 CONTEXTE - Début updateBusType');
      setLoading(true);
      await busLocationService.updateBusLocationType(busId, typeBus);
      console.log('✅ CONTEXTE - Type mis à jour, rafraîchissement des données...');
      await fetchBusLocations();
    } catch (err) {
      console.error('❌ CONTEXTE - Erreur updateBusType:', err);
      setErrorBusLocations(`Erreur lors de la mise à jour du type du bus ${busId}.`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // NOUVELLE FONCTION : Récupérer les signalements d'un bus
  const getBusReportsById = async (busId: number): Promise<any[]> => {
    try {
      console.log('🔄 CONTEXTE - Début getBusReportsById');
      const reports = await busLocationService.getAllBusReports(busId);
      console.log('✅ CONTEXTE - Signalements récupérés avec succès');
      return reports;
    } catch (err) {
      console.error('❌ CONTEXTE - Erreur getBusReportsById:', err);
      setErrorBusLocations(`Erreur lors de la récupération des signalements du bus ${busId}.`);
      throw err;
    }
  };

  // NOUVELLE FONCTION : Récupérer les bus par service de location
  const getBusByLocationServiceContext = async (id_service: number): Promise<BusByLocationServiceResponse> => {
    try {
      console.log('🔄 CONTEXTE - Début getBusByLocationService');
      console.log('🎯 ID Service:', id_service);
      
      const response = await busLocationService.getBusByLocationService(id_service);
      
      console.log('✅ CONTEXTE - Bus par service de location récupérés avec succès');
      return response;
      
    } catch (err) {
      console.error('❌ CONTEXTE - Erreur getBusByLocationService:', err);
      setErrorBusLocations(`Erreur lors de la récupération des bus pour le service ${id_service}.`);
      throw err;
    }
  };

  useEffect(() => {
    fetchBusLocations();
  }, []);

  return (
    <BusLocationContext.Provider value={{ 
      busLocations, 
      loadingBusLocations, 
      errorBusLocations, 
      refreshBusLocations: fetchBusLocations, 
      addBusLocation,
      updateBusLocation: updateBusLocationById,
      deleteBusLocation: deleteBusLocationById,
      getBusLocationById: getBusLocationByIdContext,
      updateBusStatus,
      updateBusType,
      getBusByLocationService: getBusByLocationServiceContext,
      getBusReportsById // NOUVELLE FONCTION
    }}>
      {children}
    </BusLocationContext.Provider>
  );
};

export const useBusLocationContext = () => {
  const context = useContext(BusLocationContext);
  if (!context) {
    throw new Error("useBusLocationContext doit être utilisé dans un BusLocationProvider");
  }
  return context;
};
