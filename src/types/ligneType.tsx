export interface Ligne {
    id: number;
    libelle: string;
    point_de_port: string;
    point_arrivee: string;
   
    parcourt: string;
    id_service: number;

    service_rh: {
      id: number;
      libelle: string;
    };
    created_at: string;
    last_update: string;
    id_user_created: string;
  }



  export interface LignePayload {
    id: number;
    libelle: string;
    point_de_port: string;  // Exemple : "ucc"
    point_arrivee: string;  // Exemple : "ifasic"
    parcourt: string;        // Exemple : "toutkin"
    id_service: number;     // Exemple : 2
  }
  