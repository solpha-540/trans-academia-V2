export interface Absence {
  id: number;
  nom_complet: string;
  service: string;
  date_debut: string;
  date_fin: string;
  heure_debut: string;
  heure_fin: string;
  motif: string;
  statut: 'approuvé' | 'annulé' | 'en attente' | string;
  agentId?: number;
  direction?: string;
  date_creation?: string;
}
