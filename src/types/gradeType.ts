export interface Grade {
    id: number;
    libelle: string;
    salaire: number; // nouveau champ salaire
    created_at: string; // ou Date si vous convertissez en objet Date
    last_update: string; // ou Date
    id_user_created: string;
  }


  export interface GradePayload {
    libelle: string;
    salaire: number; // nouveau champ salaire
    id_user_created_at: string;
  }