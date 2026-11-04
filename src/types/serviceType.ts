export interface Service {
    id: number;
    libelle: string;
    id_direction: number;
    created_at: string; // ou Date, si tu convertis
    last_update: string; // idem
    id_user_created: string;
  }

  export interface ServicePayload {
    id_direction: number;
    libelle: string;
  }


  // Types pour les statistiques des pannes de bus

export interface BusBreakdown {
  id_log_bus: number;
  date_panne: string;
  ligne: {
    id_ligne: number;
    libelle: string;
    point_de_depart: string;
    point_d_arrivee: string;
    parcourt: string;
  };
  commentaire: string;
  auteur_log: {
    id_user: string;
    id_generate: string;
    nom: string;
    post_nom: string;
    prenom: string;
  };
}

export interface BusInfo {
  id: number;
  num_bus: string;
  marque: string;
  modele: string;
  plaque: string;
}

export interface ServiceBusBreakdown {
  bus: BusInfo;
  pannes: BusBreakdown[];
}

export interface BusBreakdownResponse {
  code: number;
  message: string;
  data: ServiceBusBreakdown[];
}