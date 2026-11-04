// Securite Sociale type definitions

export interface SecuriteSociale {
  id?: number;
  numero: string;
  id_op_agent: number;
  id_user_created: string;
  created_at?: string;
  updated_at?: string;
}

// Payload for creating/updating securite sociale
export interface SecuriteSocialePayload {
  numero: string;
  id_op_agent: number;
  id_user_created: string;
}

export interface UpdateSecuriteSocialeData {
  numero?: string;
  id_op_agent?: number;
  id_user_created?: string;
}