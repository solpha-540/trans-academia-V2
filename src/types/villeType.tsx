export interface Ville {
    id: number;
    labele: string;
    province: number;
    Id_province?: number;
    CodeVille?: string;
    user_created_at: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface VillePayload {
    label: string;
    province: number;
    code_ville: string;
  }