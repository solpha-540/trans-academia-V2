export interface Collation {
    id: number;
    prix: number;
    bus_location_id: number;
    id_user_created: string;
    created_at: string;
    updated_at: string;
    bus_id: number;
    type_bus: string;
    categorie: string;
    nombre_bus: number;
    capacite: number;
    bus_status: string;
  }
  
  export interface CollationPayload {
    prix: number;
    bus_location_id: number;
  }