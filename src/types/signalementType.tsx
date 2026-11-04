interface Agent {
  id_user: number;
  id_generate: string;
  nom: string;
  post_nom: string;
  prenom: string;
  role: string;
  matricule?: string;
}

export interface SignalementDetail {
  categorie: string;
  type: string;
  cotation: string;
  commentaire: string;
  photos: Record<string, string>;
}

export interface Signalement {
  id: number;
  id_bus: number;
  numero_bus: string;
  marque_bus: string;
  modele_bus: string;
  carburant: string;
  heure_service: string;
  cloture_service: number | null;
  created_at: string;
  moment_origine: string;
  agent: Agent;
  signalements: SignalementDetail[];
}



export interface FullSignalement extends Signalement {
  // Propriétés supplémentaires pour le détail complet
}












