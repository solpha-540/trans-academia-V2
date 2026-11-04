export interface UserInfo {
  id_user: string;
  id_generate: string;
  nom: string;
  post_nom: string;
  prenom: string;
}

export interface LigneInfo {
  libelle: string;
}
export interface SuiviMecaniquePhotos {
  photo_1?: string | null;
  photo_2?: string | null;
  photo_3?: string | null;
}
export interface SuiviMecanique {
  id: number;
  mecanicien: UserInfo | null;
  statut?: string;
  photos?: SuiviMecaniquePhotos | null;
}

export interface BusBreakdownLog {
  id_log_bus: number;
  commentaire: string;
  auteur_log: UserInfo;

  suivi_mecanique: SuiviMecanique | null;

  photo_mecanicien: string | null;
  created_at: string | null;
  date_panne?: string | null;

  mecanicien: UserInfo | null;
  ligne?: LigneInfo | null;
}

export interface BusBreakdownResponse {
  code: number;
  message: string;
  data: BusBreakdownLog[];
}

// Type pour GET (lecture complète)
export interface Bus {
  id: number;
  num_bus: string;
  plaque: string;
  id_carte: string;
  marque: string;
  modele: string;
  capacite: number | null;
  last_update: string | null;
  categorie: string | null;
  id_user_created: string;
  is_repart: boolean;
  disponibilite: number;
  created_at: string;
  status: string;
  breakdownHistory?: BusBreakdownLog[];
}

// Type pour le payload de création (POST)
export interface BusPayload {
  num_bus: string;
  plaque: string;
  marque: string;
  modele: string;
  disponibilite: number;
  status?: string;
  id_carte?: string;
  categorie: string;
  capacite: number;
  last_update: Date | string;
  id_user_created: number;
  is_repart: boolean;
}

// Interface pour le payload de liaison bus-carte
export interface BusLinkPayload {
  id_carte: string;
  id_bus: number;
}

// Interface pour la réponse de liaison
export interface BusLinkResponse {
  code: any;
  success: boolean;
  message: string;
  data?: any;
}

// Types pour l'historique des affectations
export interface AgentInfo {
  id: number | null;
  nom: string | null;
  post_nom: string | null;
  prenom: string | null;
}

export interface AgentsAffectation {
  chauffeur: AgentInfo;
  controleur: AgentInfo;
  encadreur: AgentInfo;
  convoyeur: AgentInfo;
  lanceur: AgentInfo;
}

export interface AffectationHistoryParams {
  date_debut?: string;
  date_fin?: string;
}

export interface AffectationHistoryResponse {
  code: number;
  message: string;
  data: AffectationItem[];
}

export interface AffectationItem {
  affectation: {
    id: number;
    created_at: string;
  };
  bus: {
    num_bus: string;
    plaque: string;
    marque: string;
    modele: string;
  };
  ligne: {
    libelle: string;
    point_de_port: string;
    point_arrivee: string;
    parcourt: string;
  };
  session: {
    libelle: string;
  };
  agents: AgentsAffectation;
}

export interface BusBreakdownByLineResponse {
  code: number;
  message: string;
  data: {
    bus_detail: BusDetail;
    dossiers_mecaniques: BusBreakdownLog[];
  };
}

export interface BusDetail {
  id: number;
  id_carte: string;
  num_bus: string;
  plaque: string;
  marque: string;
  modele: string;
  disponibilite: number;
  status: string;
  created_at: string;
  last_update: string;
  id_user_created: string;
}

export interface BusStatDetail {
  id: number;
  id_carte: string | null;
  num_bus: string;
  plaque: string;
  marque: string;
  modele: string;
  disponibilite: number;
  status: string;
  is_repart: number;
  capacite: null;
  categorie: null;
  created_at: string;
  last_update: string;
  id_user_created: string;
}

export interface MarqueStat {
  marque: string;
  nombres: number;
  details_bus: BusStatDetail[];
}

export interface BusStats {
  total: number;
  disponible: number;
  indisponible: number;
  par_marque: MarqueStat[];
}

export interface BusStatsResponse {
  code: number;
  message: string;
  data: BusStats;
}

export interface BusReparationsResponse {
  code: number;
  message: string;
  data: {
    id: number;
    num_bus: string;
    marque: string;
    modele: string;
    plaque: string;
    status: string;
    disponibilite: number;
    nb_reparations: number;
  };
}


