import type { Agent } from "./agentType";

export interface DemandeIdentiteAgent {
  id_op_agent?: number;
  code_generate_tac?: string;
  nom?: string;
  post_nom?: string;
  postNom?: string;
  prenom?: string;
  service?: unknown;
}

export interface DemandePayload {
  type_demande: string;
  message: string;
  /**
   * Identifiant de l'agent qui fait la demande (demandeur)
   */
  id_agent_demandeur?: number;
  /**
   * Identifiant de l'agent qui reçoit la demande
   */
  id_agent_recepteur: number;
}

export interface Demande {
  id: number;
  type_demande: string;
  message: string;
  date_creation: string;

  statut_demande?: "en_attente" | "valide" | "rejetee" | string;

  identite_demandeur?: string | DemandeIdentiteAgent;
  identite_recepteur?: string | DemandeIdentiteAgent;

  id_agent_demandeur?: number;
  id_agent_recepteur?: number;

  // Relations renvoyées éventuellement par le backend
  demandeur?: Agent;
  recepteur?: Agent;
}

export type DemandeDirection = "sent" | "received";

// Représente un élément d'historique pensé comme un "message" dans une
// boîte d'envoi (sent) ou de réception (received).
export interface DemandeHistoryItem extends Demande {
  direction: DemandeDirection;
}