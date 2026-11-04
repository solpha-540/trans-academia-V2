export interface Client {
  id: number;
  nom_complet: string;
  sexe: 'M' | 'F';
  telephone: string;
  email: string;
  id_user_created: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusLocation {
  id: number;
  type_bus: string;
  type?: string; // Alias for type_bus for flexible access
  categorie: 'standard' | 'premium';
  nombre_bus: number;
  nombre?: number; // Alias for nombre_bus
  capacite: number;
  status?: 'disponible' | 'indisponible';
  id_user_created: string;
  created_at?: string;
  updated_at?: string;
}

export interface Destination {
  id: number;
  nom: string;
  zone: string;
  id_user_created?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Tarif {
  id: number;
  prix: number;
  caution: number;
  total: number;
  bus_location_id?: number;
  destination_id?: number;
  created_at?: string;
  updated_at?: string;
  
  // Optional populated relations
  bus_location?: BusLocation;
  destination?: Destination;
}

export interface Reservation {
  // Champs de base
  id?: number;
  tarif_id: number;
  collation_id?: number;
  client_id: number;
  is_collation: boolean | number;
  prix_collation?: number;
  nombre_bus: number;
  nombre_bus_reserve: number;
  date_depart: string;
  heure_depart: string;
  preuve_paiement?: string | null;
  note?: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'processing' | 'closed';
  id_user_created: string;
  created_at?: string;
  updated_at?: string;
  
  // Client properties (flat structure from API)
  nom_complet: string;
  sexe: 'M' | 'F';
  email: string;
  telephone: string;
  client_nom?: string;
  client_telephone?: string | number;
  client_email?: string;
  client_sexe?: 'M' | 'F';
  
  // Nouveaux champs pour l'entreprise
  is_entreprise?: number;
  nom_entreprise?: string;
  
  // Champs pour l'immobilisation
  is_immobilization?: number;
  nombre_jours?: number;
  
  // Optional populated client object
  client?: Client;
  
  // Bus properties (flat structure from API)
  bus_type?: string;
  bus_categorie?: string;
  bus_nombre?: number;
  bus_capacite?: number;
  bus_status?: string;
  
  // Optional populated bus object
  bus?: BusLocation;
  
  // Destination properties (flat structure from API)
  destination_nom?: string;
  destination_zone?: string;
  
  // Optional populated destination object
  destination?: Destination;
  
  // Optional populated tarif object
  tarif?: Tarif;
  
  // Champs calculés
  tarif_prix?: number;
  tarif_caution_pourcentage?: string;
  tarif_caution?: number;
  tarif_total: number;
  
  // Champs pour les réductions
  is_discount?: number | boolean;
  total_payement?: number;
  pourcentage_discount?: number;
  total_reduction?: string | number;
  montant_reduction?: number;
  
  // Collation properties (flat structure from API)
  collation_prix?: number | null;
  collation_bus_type?: string;
  collation_bus_categorie?: string;
  collation_bus_nombre?: number;
  collation_bus_capacite?: number;
  collation_bus_status?: string;
  
  // Optional populated collation object
  collation?: {
    id: number;
    prix: number;
    bus_location_id: number;
    type_bus: string;
    categorie: string;
    nombre_bus: number;
    capacite: number;
    bus_status: string;
  };
}

export interface ReservationPayload {
  tarif_id: number;
  collation_id?: number;
  client_id: number;
  is_collation: boolean;
  prix_collation?: number;
  nombre_bus: number;
  date_depart: string;
  heure_depart: string;
  note?: string;
  nom_complet: string;
  sexe: 'M' | 'F';
  email: string;
  is_immobilization: number;
  nombre_jours: number;
  nombre_personnes?: number;
  nom_entreprise?: string;
  is_entreprise?: number;
  
  telephone: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'processing'| 'confirmée' | 'closed';

  
}

export type ReservationStatus = 'pending' | 'confirmed' | 'canceled'| 'closed';

export interface ReservationFilters {
  searchTerm?: string;
  typeBus?: string;
  categorie?: string;
  statut?: string;
  catering?: string;
  startDate?: string;
  endDate?: string;
  minMontant?: number;
  maxMontant?: number;
}

export interface ReservationStats {
  totalReservations: number;
  totalMontant: number;
  reservationsConfirmees: number;
  reservationsAvecCatering: number;
  reservationsByTypeBus: Record<string, number>;
  reservationsByCategorie: Record<string, number>;
}