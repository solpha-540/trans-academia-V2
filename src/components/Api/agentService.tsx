import { Agent, Autorisation, HistoriqueModification, HistoriqueResponse, StatutAutorisation } from "../../types/agentType";
import api from "./axiosConfig";
import { UserRoleCount, UserRoleCountResponse } from "../../types/role";
import { UpdateAgentPersonalInfoData } from "../../types/agentType";
import { HistoriqueAdresseAgent, HistoriqueAdresseResponse } from "../../types/adresseType";
import { toast } from "react-toastify";

export type { UserRoleCount };

export interface AgentPrintStatusResponse {
  code: number;
  message: string;
  data: {
    id_impression: string;
    Id_card: string;
    status_impression: string;
    Id_user_created_at: string;
  };
}

export interface PrintedAgentCard {
  agentId: number;
  matricule: string | null;
  codeGenerateTac: string | null;
  nom: string | null;
  postNom: string | null;
  prenom: string | null;
  photo: string | null;
  fonctionLibelle: string | null;
  serviceLibelle: string | null;
  directionLibelle: string | null;
  impressionId: number;
  statusImpression: string;
  dateImpression: string;
  idUserImpression: string;
  status_carte: string;
}

interface PrintedAgentCardsResponse {
  code: number;
  message: string;
  data: PrintedAgentCard[];
}

export type CardStatusValue = 'ACTIVER' | 'DESACTIVER';

export interface UpdateCardStatusResponse {
  code: number;
  message: string;
  data: {
    Id_card: string;
    status_carte: string;
  };
}

export const getPrintedAgentCards = async (): Promise<PrintedAgentCard[]> => {
  try {
    const response = await api.get<PrintedAgentCardsResponse>('/agent/ListAgentCarteService');

    if (response.data.code !== 200) {
      throw new Error(response.data.message || 'Impossible de récupérer la liste des cartes imprimées.');
    }

    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Impossible de récupérer la liste des cartes imprimées.';
    console.error('Erreur lors de la récupération des cartes imprimées :', error);
    throw new Error(message);
  }
};

export const agentPrintStatus = async (agentId: number): Promise<AgentPrintStatusResponse> => {
  try {
    const response = await api.post<AgentPrintStatusResponse>('/agent/AgentCarteService', {
      id_op_agent: agentId,
    });

    if (response.data.code !== 201) {
      throw new Error(response.data.message || "Impossible d'enregistrer l'impression de la carte.");
    }

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Impossible d'enregistrer l'impression de la carte.";
    console.error("Erreur lors de l'enregistrement de l'impression :", error);
    throw new Error(message);
  }
};

export const updateCardStatus = async (
  idCard: string,
  statusImpression: CardStatusValue = 'DESACTIVER',
): Promise<UpdateCardStatusResponse> => {
  const normalizedId = idCard?.trim();
  if (!normalizedId) {
    throw new Error('Le code de carte est requis.');
  }

  try {
    const response = await api.put<UpdateCardStatusResponse>('/agent/StatutCarte', {
      Id_card: normalizedId,
      status_impression: statusImpression,
    });

    if (response.data.code !== 200) {
      throw new Error(response.data.message || 'Impossible de mettre à jour le statut de la carte.');
    }

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Impossible de mettre à jour le statut de la carte.';
    console.error('Erreur lors du changement du statut de la carte :', error);
    throw new Error(message);
  }
};

export interface Absence {
  id: number;
  nom_complet: string;
  service: string;
  date_debut: string;
  date_fin: string;
  heure_debut: string;
  heure_fin: string;
  motif: string;
  statut: 'en attente' | 'approuvé' | 'refusé';
}

export const getAgents = async (): Promise<[Agent]> => {
  try {
    const response = await api.get('/agent/ListeAgent');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des agents :", error);
    throw error;
  }
};

export const getUsersCountByRole = async (): Promise<UserRoleCount[]> => {
  try {
    console.log('🔍 Récupération du nombre d\'utilisateurs par rôle...');
    const response = await api.get<UserRoleCountResponse>('/agent/usersCountByRole');
    console.log('✅ Réponse users by role:', response.data);

    if (response.data.code === 200) {
      console.log(`📊 ${response.data.data.length} rôles récupérés`);
      return response.data.data;
    } else {
      const errorMessage = response.data.message || 'Erreur inconnue du serveur';
      console.error('❌ Erreur API:', errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error('💥 Erreur lors de la récupération des utilisateurs par rôle:', error);
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || `Erreur ${status}`;
      switch (status) {
        case 404:
          throw new Error('Endpoint usersCountByRole non trouvé');
        case 500:
          throw new Error('Erreur interne du serveur');
        default:
          throw new Error(message);
      }
    } else if (error.request) {
      throw new Error('Impossible de contacter le serveur');
    } else {
      throw new Error('Erreur de configuration de la requête');
    }
  }
};

export const deleteAgent = async (id: number): Promise<void> => {
  try {
    await api.delete(`/agent/deleteAgent?id=${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'agent :", error);
    throw error;
  }
};

export const getAgentById = async (id: number): Promise<Agent | null> => {
  try {
    const response = await api.get(`/agent/ListeAgent`, { params: { id } });
    const agents: Agent[] = response.data.data;
    if (agents && agents.length > 0) {
      return agents[0];
    }
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'agent avec id=${id} :`, error);
    throw error;
  }
};

export const getSpecimenCard = async (): Promise<any> => {
  try {
    const response = await api.get(`/agent/specimen?id=8`);
    console.log('✅ Réponse specimen:', response.data);
    if (response.data.code === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la récupération du specimen');
    }
  } catch (error: any) {
    console.error('Erreur lors de la récupération du specimen :', error);
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || `Erreur ${status}`;
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Impossible de contacter le serveur');
    } else {
      throw new Error('Erreur de configuration de la requête');
    }
  }
};

// Mettre à jour un agent complet (pour la photo)
export const updateAgentPhoto = async (id: number, photoFile: File): Promise<{ success: boolean; message: string; data?: Agent }> => {
  try {
    console.log('=== updateAgentPhoto appelé ===');
    console.log('ID:', id);
    console.log('Fichier:', photoFile.name);
    
    const formData = new FormData();
    formData.append('id_op_agent', id.toString());
    formData.append('photo', photoFile);
    
    console.log('FormData envoyé:');
    console.log('- id_op_agent:', id);
    console.log('- photo:', photoFile.name);
    
    const response = await api.post('/agent/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Réponse API:', response.data);
    
    if (response.data && response.data.code === 200) {
      toast.success(response.data.message || 'Photo mise à jour avec succès');
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      toast.error(response.data?.message || 'Erreur lors de la mise à jour');
      return {
        success: false,
        message: response.data?.message || 'Erreur lors de la mise à jour'
      };
    }
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error);
    toast.error('Erreur lors de la mise à jour de la photo');
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la mise à jour'
    };
  }
};

export const confirmMultipleAgentsDrh = async (id_op_agent: number[]): Promise<any> => {
  try {
    const response = await api.post('/agent/validationDrh', { id_op_agent });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la confirmation multiple DRH :', error);
    throw error;
  }
};

export const confirmMultipleAgentsDg = async (id_op_agent: number[]): Promise<any> => {
  try {
    const response = await api.post('/agent/validationDg', { id_op_agent });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la confirmation DG :', error);
    throw error;
  }
};

export const autorisationAgent = async (
  id_op_agent: string, 
  statut: StatutAutorisation = "valide",
  id_demande?: number
): Promise<Autorisation> => {
  try {
    const body: any = { id_op_agent, statut };
    if (id_demande != null) {
      body.id_demande = id_demande;
    }
    const response = await api.post('/autorisation/createAutorisation', body);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'autorisation de l\'agent :', error);
    throw error;
  }
};

export const getHistoriqueAdresseAgent = async (): Promise<HistoriqueAdresseAgent[]> => {
  try {
    console.log('🔍 Récupération de l\'historique des adresses des agents...');
    const response = await api.get<HistoriqueAdresseResponse>('/agent/historiqueAdresseAgent');
    console.log('✅ Réponse historique adresse:', response.data);
    if (response.data.code === 200) {
      console.log(`📊 ${response.data.data.length} adresses récupérées`);
      return response.data.data;
    } else {
      const errorMessage = response.data.message || 'Erreur inconnue du serveur';
      console.error('❌ Erreur API:', errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error('💥 Erreur lors de la récupération de l\'historique des adresses:', error);
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || `Erreur ${status}`;
      switch (status) {
        case 404:
          throw new Error('Endpoint historique adresse non trouvé');
        case 500:
          throw new Error('Erreur interne du serveur');
        default:
          throw new Error(message);
      }
    } else if (error.request) {
      throw new Error('Impossible de contacter le serveur');
    } else {
      throw new Error('Erreur de configuration de la requête');
    }
  }
};

export const getHistoriqueModifications = async (): Promise<HistoriqueModification[]> => {
  try {
    console.log('🔍 Récupération de l\'historique des modifications...');
    const response = await api.get<HistoriqueResponse>('/autorisation/historique');
    console.log('✅ Réponse historique:', response.data);
    if (response.data.code === 200) {
      console.log(`📊 ${response.data.data.length} modifications récupérées`);
      return response.data.data;
    } else {
      const errorMessage = response.data.message || 'Erreur inconnue du serveur';
      console.error('❌ Erreur API:', errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error('💥 Erreur lors de la récupération de l\'historique:', error);
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || `Erreur ${status}`;
      switch (status) {
        case 404:
          throw new Error('Endpoint historique non trouvé');
        case 500:
          throw new Error('Erreur interne du serveur');
        default:
          throw new Error(message);
      }
    } else if (error.request) {
      throw new Error('Impossible de contacter le serveur');
    } else {
      throw new Error('Erreur de configuration de la requête');
    }
  }
};

export const updateEnfant = async (enfantId: number, data: any): Promise<void> => {
  try {
    const response = await api.put(`/agent/UpdateEnfant?enfant_id=${enfantId}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'enfant :", error);
    throw error;
  }
};

export const updateAgentPersonalInfo = async (
  agentId: number, 
  data: UpdateAgentPersonalInfoData
): Promise<Agent> => {
  try {
    const formData = new FormData();
    formData.append('nom', data.nom);
    formData.append('post_nom', data.post_nom);
    formData.append('prenom', data.prenom);
    formData.append('sexe', data.sexe);
    formData.append('date_naissance', data.date_naissance);
    formData.append('etat_civil', data.etat_civil);
    formData.append('telephone_un', data.telephone_un);
    formData.append('mail', data.mail);
    formData.append('commune', data.commune);
    formData.append('quartier', data.quartier);
    if (data.id_fonction && data.id_fonction > 0) {
      formData.append('id_fonction', data.id_fonction.toString());
    }
    if (data.id_grade && data.id_grade > 0) {
      formData.append('id_grade', data.id_grade.toString());
    }
    formData.append('contrat', data.contrat);
    formData.append('date_embauche', data.date_embauche);
    formData.append('domaine_etude', data.domaine_etude);
    if (data.telephone_deux) formData.append('telephone_deux', data.telephone_deux);
    if (data.telephone_trois) formData.append('telephone_trois', data.telephone_trois);
    if (data.avenue) formData.append('avenue', data.avenue);
    if (data.num_parcelle) formData.append('num_parcelle', data.num_parcelle);
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    console.log('📡 Envoi de la requête de mise à jour:', { agentId, data: Object.fromEntries(formData) });

    const response = await api.post(`/agent/updateAgent?id=${agentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('✅ Réponse de mise à jour:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour des informations personnelles:', error);
    if (error.response) {
      console.error('📋 Détails de l\'erreur:', {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message
      });
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Erreur ${error.response.status} lors de la mise à jour`;
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('📋 Pas de réponse du serveur:', error.request);
      throw new Error('Impossible de contacter le serveur');
    } else {
      console.error('📋 Erreur de configuration:', error.message);
      throw error;
    }
  }
};

export const createEnfant = async (agentId: number, data: any): Promise<void> => {
  try {
    const response = await api.post(`/agent/AddEnfant?agent_id=${agentId}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'enfant :", error);
    throw error;
  }
};

export const getAllAbsences = async (): Promise<Absence[]> => {
  try {
    const response = await api.get('/agent/GetAllAbsences');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des absences', error);
    throw error;
  }
};

export interface UpdateAbsenceStatusPayload {
  id: number;
  statut: string;
  commentaire_rh: string;
}

export interface UpdateAbsenceStatusResponse {
  code: number;
  message: string;
  data: {
    id: number;
    statut: string;
    commentaire_rh: string;
  };
}

export const updateAbsenceStatus = async (
  payload: UpdateAbsenceStatusPayload
): Promise<UpdateAbsenceStatusResponse['data']> => {
  try {
    const response = await api.put('/agent/UpdateAbsenceStatus', payload);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de l'absence", error);
    throw error;
  }
};
