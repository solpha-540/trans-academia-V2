export interface Tarif {
    id: number;
    prix: number;
    caution_pourcentage: number;
    destination_id: number;
    bus_location_id: number;
    durree: string | null; // Ajouter ce champ
    tarif_total: number;
    created_at: string;
    tarif?: number;
    updated_at: string;
    id_user_created: string;
    
    // Relations (peuvent être optionnelles selon la réponse API)
    bus_nom?: string;
    destination_libelle?: string;
    zone?: string;
  }
  
  export interface TarifPayload {
    prix: number;
    caution_pourcentage: number;
    destination_id: number;
    bus_location_id: number;
    durree: string | null; // Peut être null pour les destinations hors Kinshasa
  }