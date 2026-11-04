// Form data interfaces for all forms
export interface InformationPersonnelData {
    // Personal Identity
    nom: string;                    // Last name - Required
    post_nom: string;              // Middle name - Required
    prenom: string;                // First name - Required
    
    // Personal Details
    sexe: string;                  // Gender (M/F) - Required
    date_naissance: string;        // Birth date (YYYY-MM-DD) - Required
    etat_civil: string;           // Marital status - Required
    
     telephone: string;  
    // Contact Information
    telephone_un: string;  
    telephone_deux: string; 
            // Phone number - Required (min 9 digits)
    mail: string;                  // Email address - Required (valid format)
    
    // Address Information
    commune: string;               // Commune - Required
    quartier: string;              // District/Quarter - Required
    avenue: string;                // Avenue - Optional
    num_parcelle: string;       // Plot number - Optional
    
    // Photo Upload
    photo: File | null;            // Profile photo - Optional (jpg, png, max 5MB)
    
    // Agent Information
    contrat: string;               // Contract - Required
    date_embauche: string;         // Hiring date - Required
    domaine_etude: string;         // Study field - Required
    id_fonction: string;           // Function ID - Required
    id_grade: string;              // Grade ID - Required

    id_user_created: string;       // User ID - Required
    role: string;                  // User role - Required
  }
  
  export interface DossierProfessionnelData {
    poste_actuel: string;          // Current position - Required
    entreprise: string;            // Company name - Required
    secteur_activite: string;      // Activity sector - Optional
    annees_experience: string;     // Years of experience - Optional (numeric)
    niveau_etudes: string;         // Education level - Required
    salaire_annuel: string;        // Annual salary - Optional (numeric)
    description_poste: string;     // Job description - Optional
  }
  
  export interface IdentiteConjointData {
    nom: string;                    // Spouse last name - Required
    post_nom: string;               // Spouse first name - Required
    prenom: string;                // Spouse first name - Required
    sexe: "M" | "F";               // Gender - Required (M for Male, F for Female)
    acte_mariage: File | null;     // Marriage certificate file - Optional
    photo: File | null;            // Spouse photo file - Optional             
    date_naissance: string;        // Spouse birth date - Optional
    lieu_naissance: string;        // Spouse birth place - Optional
    telephone: string;             // Spouse phone - Optional
    id_op_agent: number;        // id_op_agent - Required
    id_user_created: string;            // id_user_created - Optional
  }
  
  export interface LesEnfantsData {
    nombre_enfants: string;        // Number of children - Optional (numeric)
    nom_enfant_1: string;          // First child name - Conditional
    date_naissance_1: string;      // First child birth date - Optional
    ecole_etablissement_1: string; // First child school - Optional
    nom_enfant_2: string;          // Second child name - Optional
    date_naissance_2: string;      // Second child birth date - Optional
    informations_supplementaires: string; // Additional info - Optional
  }
  
  export interface AptitudesData {
    groupe_sanguin: string;       // Blood group - Optional
    allerigie: string;            // Allergies - Optional
    etat_de_sante: string;       // Health condition - Optional
    id_op_agent: number;        // id_op_agent - Required
    id_user_created: string;            // id_user_created - Optional 
  }
  
  export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
  }