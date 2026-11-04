// Dans agentType.ts, ajoutez ces interfaces :

export interface HistoriqueAdresseAgent {
  agent_id: number;
  personne_id: number;
  nom: string;
  post_nom: string;
  prenom: string;
  sexe: string;
  mail: string;
  telephone_un: number;
  photo: string;
  avenue: string;
  quartier: string;
  num_parcelle: string;
  commune: string;
  ville: string;
  province: string;
}

export interface HistoriqueAdresseResponse {
  code: number;
  message: string;
  data: HistoriqueAdresseAgent[];
}