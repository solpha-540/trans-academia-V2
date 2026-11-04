// Salaire type definitions

export interface Salaire {
  id?: number;
  numero_compte: string;
  nom_banque: string;
  id_op_agent: number;
  id_user_created: string;
  id_salaire: number;
  created_at?: string;
  updated_at?: string;
}

// Payload for creating/updating salaire
export interface SalairePayload {
  numero_compte: string;
  nom_banque: string;
  id_op_agent: number;
  id_user_created: string;
}

export interface SalaireUpdatePayload {
  numero_compte: string;
  nom_banque: string;
  id_op_agent: number;
}