// Cursus type definitions

export interface Cursus {
  id?: number;
  niveau_etude: string;
  filiere: string;
  annee_terminale?: string;
  etablissement: string;
  id_op_agent: number;
  cursus_academique_id?: number;
  id_user_created: string;
  created_at?: string;
  updated_at?: string;
}

// Payload for creating/updating cursus
export interface CursusPayload {
  niveau_etude: string;
  filiere: string;
  annee_terminale: string;
  
  etablissement: string;
  id_op_agent: number;
  id_user_created: string;
}

// Type pour la mise à jour avec ID
export interface UpdateCursusPayload extends CursusPayload {
  cursus_academique_id?: number;
  id?: number;
}