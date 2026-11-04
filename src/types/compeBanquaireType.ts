
export interface CompteBancaire {
  id: number;
  numero_compte: string;
  nom_banque: string;
  id_op_agent: number;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateCompteBancairePayload {
  numero_compte: string;
  nom_banque: string;
  id_op_agent: number;
}