export interface DossierProfessionnel {
  id: number;
  id_op_agent: number;
  id_user_created: string;
  curiculum_vitae: string;
  diplome_etat: string;
  diplome_gradua: string;
  diplome_licence: string;
  created_at?: string;
  updated_at?: string;
}

export interface DossierProfessionnelPayload {
  id_op_agent: number;
  id_user_created: string;
  curiculum_vitae: File | null;
  diplome_etat: File | null;
  diplome_gradua: File | null;
  diplome_licence: File | null;
}

export interface UpdateDossierProfessionnelData {
  id_user_created: string;
  curiculum_vitae?: File | null;
  diplome_etat?: File | null;
  diplome_gradua?: File | null;
  diplome_licence?: File | null;
}