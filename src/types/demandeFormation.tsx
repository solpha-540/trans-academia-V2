// types/demandeFormationType.ts

export interface DemandeFormation {
  id: number;
  agent_id: number;
  nom_centre: string;
  nombre_personnes: number;
  date_debut: string;
  date_fin: string;
  montant: string | number;
  description?: string;
  statut?: string;
  last_update?: string;
  created_at?: string;
  id_user_created?: string;
}

export interface DemandeFormationResponse {
  success: boolean;
  message: string;
  data?: DemandeFormation;
  errors?: Record<string, string[]>;
}