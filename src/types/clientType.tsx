export interface Client {
    id: number;
    nom_complet: string;
    sexe: 'M' | 'F';
    telephone: string;
    email: string;
    id_user_created: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface ClientPayload {
    nom_complet: string;
    sexe: 'M' | 'F';
    telephone: string;
    email: string;
  }