export interface Fonction {
    id: number;
    libelle: string;
    id_service: number;
    created_at: string; // ou Date si vous convertissez la string en Date
    last_update: string; // ou Date
    id_user_created: string;
  }
  export interface FonctionPayload {
    id_service: number;
    libelle: string;
    id_user_created: string;
  }