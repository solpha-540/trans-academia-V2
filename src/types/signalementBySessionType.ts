// Types pour un agent individuel
export interface AgentInfo {
  id: number | null;
  nom: string | null;
  post_nom: string | null;
  prenom: string | null;
}

// Types pour les agents par rôle
export interface AgentsByRole {
  chauffeur: AgentInfo;
  verificateur: AgentInfo;
  encadreur: AgentInfo;
  convoyeur: AgentInfo;
}

// Types pour le bus
export interface BusSession {
  id?: number;
  num_bus: string;
  plaque: string;
  marque: string;
  modele: string;
}

// Types pour la ligne
export interface LigneSession {
  libelle: string;
}

// Types pour la session
export interface Session {
  id: number;
  libele: string;
  debut?: string;
  find?: string;
  created_at?: string;
}

// Types pour l'affectation
// NB: La réponse API peut renvoyer soit null, soit un objet partiel (ligne en string, sans bus/session).
export interface AffectationSession {
  id: number;
  created_at: string;
  ligne: string | LigneSession;
  agents: AgentsByRole;
}

// Types pour le détail de signalement
export interface SignalementSessionDetail {
  categorie: string;
  cotation: string;
  commentaire: string;
  photos: string;
  auteur: string;
  created_at: string;
}

export interface MecanicienInfo {
  id_user: string | null;
  id_generate: string | null;
  nom: string | null;
  post_nom: string | null;
  prenom: string | null;
}

export interface SignalementLogMecanique {
  id_log_bus: number;
  commentaire: string;
  auteur_log: MecanicienInfo;
  id_suivi_mecanique: number | null;
  photo_mecanicien: string | null;
  created_at: string | null;
  mecanicien: MecanicienInfo;
}

// Types pour le signalement
export interface SignalementInfo {
  id: number;
  positif?: boolean;
  carburant: string;
  kilometrage: string;
  heure_service: string;
  cloture_service: number | null;
  created_at: string;
  details: SignalementSessionDetail[];
  log_mecanique?: SignalementLogMecanique[];
}

// Types pour un enregistrement complet (affectation + signalement)
export interface SignalementBySession {
  bus?: BusSession;
  affectation: AffectationSession | null;
  signalement: SignalementInfo;
}

// Types pour les paramètres de filtrage
export interface SignalementBySessionParams {
  id_session: number;
  date_debut?: string;
  date_fin?: string;
}

// Types pour la réponse API
export interface SignalementBySessionResponse {
  success: boolean;
  message?: string;
  data: SignalementBySession[];
}

// Types pour le groupement par catégorie
export interface SignalementGroupedByCategorie {
  categorie: string;
  count: number;
  items: SignalementSessionDetail[];
  cotations: {
    bon: number;
    moyen: number;
    mauvais: number;
  };
}

// Types pour les statistiques de session
export interface SessionStats {
  totalSignalements: number;
  totalBus: number;
  totalAgents: number;
  byCategorie: SignalementGroupedByCategorie[];
  clotureRate: number;
}
