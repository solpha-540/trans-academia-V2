export type AptitudePhysiquePayload = {
    groupe_sanguin: string;
    allerigie: string;
    etat_de_sante: string;
    id_op_agent: number;
    id_user_created: string | null ;
  };

  export type AptitudePhysique = {
    id: number;
    groupe_sanguin: string;
    allerigie: string;
    allergie:string;
    etat_de_sante: string;
    id_op_agent: number;
    created_at: string;       // ou Date si parsé
    last_updated: string;     // ou Date si parsé
    id_user_created: string;
    agent_matricule: string;
    id_agent:number;
    agent_nom: string;
    agent_prenom: string;
    description?: string;     // Added for UI compatibility
    dateEvaluation?: string;  // Added for UI compatibility
    resultat?: string;        // Added for UI compatibility
  };


  export interface UpdateAptitudeData {
    groupe_sanguin: string;
    allerigie: string;
    etat_de_sante: string;
  }