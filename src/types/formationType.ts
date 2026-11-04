// Formation type definitions

export interface Formation {
  id?: number;
  nomFormation: string;
  etablissement: string;
  experience: string;
  annee: string;
  document: string;
  intitule: string;
  organisme: string;
  date_debut: string;
  date_fin: string;
  certificat: string;
  description: string;
  id_op_agent: number;
  id_user_created: string;
  created_at?: string;
  updated_at?: string;
}

// Payload for creating/updating formation
export interface FormationPayload {
  nom_formation: string;
  etablissement: string;
  experience: string;
  annee: string;
  document: string;
  id_op_agent: number;
  id_user_created: string;
}

// Interface for updating formation data
export interface UpdateFormationData {
 nom_formation: string;
 etablissement: string;
 experience: string;
 annee: string;
 document: File | null;
 id_op_agent: number;
}