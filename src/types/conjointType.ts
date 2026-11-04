export interface ConjointPayload {
    nom: string;
    post_nom: string;
    prenom: string;
    sexe: "M" | "F";
    date_naissance: string; // format "YYYY-MM-DD"
    lieu_naissance: string;
    telephone: string; // string car c'est envoyé comme texte
    id_op_agent: number;
    id_user_created: string;
    acte_mariage: File | null; // Acte de mariage scanné
    photo: File | null; // Photo du conjoint
  }


  export interface Conjoint {
    id: number;
    nom: string;
    postnom: string;
    prenom: string;
    sexe: string;
    date_naissance: string; // peut être converti en Date si besoin
    lieu_naissance: string;
    telephone: number; // ici c'est bien reçu comme number
    id_op_agent: number;
    created_at: string; // ou Date
    last_update: string; // ou Date
    id_user_created: string;
    acte_mariage: string; // File path/URL for marriage certificate
  }



  // Interfaces pour les formulaires de mise à jour
export interface UpdateConjointData {
  nom: string;
  postnom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  telephone: string;
  sexe: 'M' | 'F';
  id_op_agent: number;
  acte_mariage?: File | null;
  acte_mariage_file?: File | null;
  [key: string]: any; // Permet d'ajouter des propriétés dynamiques
}
  