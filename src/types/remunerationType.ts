// Remuneration type definitions

export interface Remuneration {
  id?: number;
  agent_id?: number;
  id_op_agent: number;
  id_prime: number;
  created_at?: string;
  last_update?: string;
  id_user_created: string;
  agent_matricule?: string;
  agent_nom?: string;
  agent_prenom?: string;
  libele?: string;
  montant?: string;
  type_prime?: string;
}

// Payload for creating remuneration
export interface RemunerationPayload {
  id_op_agent: number;
  id_prime: number;
  id_user_created: string;
}

// Response structure from API
export interface RemunerationResponse {
  code: number;
  message: string;
  data: Remuneration[];
}