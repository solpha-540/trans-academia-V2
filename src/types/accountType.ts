// Types pour la gestion des comptes d'agents

export interface Account {
  id?: number;
  agentId: number;
  telephone: number;
  pwd: string;
  pwd_repeat: string;
  role: string;
  id_user_created: string;
  created_at?: string;
  updated_at?: string;
}

// Interface pour la liste des comptes depuis l'API
export interface AccountList {
  nomCompletAgent: string | null;
  login: string;
  roleLibelle: string;
  userCreatedAt: string;
  id_generate: string;
  user_type: string;
  userLastUpdate: string;
  agentId: number | null;
  // Add these fields for update functionality
  roleId?: string | number; // Role ID for the select
  currentLogin?: string; // Current login value
  is_active?: number; // 1 = actif, 0 = désactivé (optionnel)
}

// Dans vos types (accountType.ts)
export interface AccountPayload {
  agentId: number;
  login: string;
  pwd: string;
  pwd_repeat: string;
  id_user_created: string;
  telephone?: string; // Rendre optionnel
  role?: string; // Rendre optionnel
}
export interface AccountResponse {
  success: boolean;
  message: string;
  data?: Account | null;
}

export interface UpdateAccountAgentPayload {
  Agent_id: number;
  login: string;
  pwd: string;
  pwd_repeat: string;
  role: string;
}

export interface UpdateAccountFormValues {
  agentId: number | null;
  login: string;
  pwd: string;
  pwd_repeat: string;
  role: string;
}

// Interface pour les agents (pour la sélection)
export interface AgentForAccount {
  id: number;
  nom: string;
  post_nom: string;
  prenom: string;
  telephone?: string;
  mail?: string;
  fonction?: string;
  grade?: string;
}