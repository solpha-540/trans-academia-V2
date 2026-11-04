export interface EnfantPayload {

    nom: string
    postnom: string
    prenom: string
    sexe: string
    date_naissance: string
    lieu_naissance: string
    id_agent: number
    attestation_naissance?: string | File
    id_user_created: string
} 


export interface Enfant {

    id: number
    nom: string
    postnom: string
    prenom: string
    sexe: string
    date_naissance: string
    lieu_naissance: string
    id_agent: number
    attestation_naissance: string
    created_at: string
    last_updated: string
    id_user_created: string 
    
}


// Dans l'interface UpdateEnfantData
export interface UpdateEnfantData {
    nom: string;
    postnom: string;
    prenom: string;
    date_naissance?: string;
    lieu_naissance?: string;
    sexe?: string;
    attestation_naissance?: File; // Ajout du champ attestation_naissance
  }
