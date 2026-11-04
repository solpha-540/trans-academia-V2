export interface Destination {
    id: number;
    zone: string;
    libelle: string;
    kilometrage?: string;
    is_longue_distance: number | boolean;
    created_at: string;
    updated_at: string;
    id_user_created: string;
    bus_location_id?: number;
  }
  
  export interface DestinationPayload {
    zone: string;
    libelle: string;
    kilometrage?: string;
    is_longue_distance: boolean;
    bus_location_id?: number;
  }