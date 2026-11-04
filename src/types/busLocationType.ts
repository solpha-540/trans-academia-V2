import { SignalementDetail } from "./signalementType";


export type BusStatus = "disponible" | "indisponible" | undefined;
export interface BusLocation {
    id: number;
    type_bus: string;
    bus_reste: number;
    categorie: 'standard' | 'premium';
    nombre_bus: number;
    capacite: number;
    prix_immobilisation?: number;
    status?: BusStatus;
    id_user_created: string;
    created_at?: string;
    updated_at?: string;
  }


  export interface BusReportData {
  id: number;
  id_bus: number;
  numero_bus: string;
  marque_bus: string;
  modele_bus: string;
  disponibilite_bus: number;
  carburant: string;
  auteur: string;
  heure_service: string;
  cloture_service: string | null;
  created_at: string;
  moment_origine: string;
  signalements: SignalementDetail[];
}
  
  export interface BusLocationPayload {
    type_bus: string;
    categorie: 'standard' | 'premium';
    nombre_bus: number;
    bus_reste: number; // Ajoutez cette ligne
    capacite: number;
    status?: BusStatus;
    id_user_created: string;
  }
  
  export interface BusLocationFilters {
    searchTerm?: string;
    categorie?: 'standard' | 'premium';
    status?: 'disponible' | 'indisponible';
    minCapacite?: number;
    maxCapacite?: number;
  }


  export interface BusByLocationServiceResponse {
    code: number;
    message: string;
    data: Array<{
      id: number;
      id_service: number;
      id_bus: number;
      created_at: string;
      last_update: string;
      id_user_created: string;
      bus: {
        id: number;
        id_carte: string;
        num_bus: string;
        plaque: string;
        marque: string;
        modele: string;
        disponibilite: number;
        status: string;
        created_at: string;
        last_update: string;
        id_user_created: string;
      };
    }>;

    
  }