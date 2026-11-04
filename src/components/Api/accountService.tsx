import { Agent } from "../../types/agentType";
import { AccountResponse,AccountList } from "../../types/accountType";
import api from "./axiosConfig";
import { getIdUserCreated } from "../../utils/auth";

// Fetch all agents
export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const response = await api.get('/agent/ListeAgent');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des agents :", error);
    throw error;
  }
};

// get account 
export const fetchAccountsList = async (): Promise<AccountList[]> => {
  try {
    const response = await api.get('/agent/GetAllCompteAgent');
    return response.data.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes :", error);
    throw error;
  }
};


// Add this function to accountService.tsx after the createAccountAgent function

export const updateAccountAgent = async (agentId: number, login: string, pwd: string, pwd_repeat: string, role: string): Promise<AccountResponse> => {
  try {
    console.log('Mise à jour du compte avec les données:', { agentId, login, role });
    
    const payload: Record<string, any> = {
      Agent_id: agentId,
    };

    if (String(login || '').trim()) {
      payload.login = login;
    }

    if (String(role || '').trim()) {
      payload.role = role;
    }

    const hasPwd = String(pwd || '').trim().length > 0;
    const hasPwdRepeat = String(pwd_repeat || '').trim().length > 0;
    if (hasPwd || hasPwdRepeat) {
      payload.pwd = pwd;
      payload.pwd_repeat = pwd_repeat;
    }

    console.log('Payload envoyé pour la mise à jour:', payload);
    
    const response = await api.put('/agent/UpdateCompteAgent', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => {
        return (status >= 200 && status < 300) || status === 400;
      }
    });

    if (response.status === 200 || response.data?.success === true) {
      return {
        success: true,
        message: response.data?.message || "Compte mis à jour avec succès",
        data: response.data?.data
      };
    }

    return {
      success: false,
      message: response.data?.message || "Erreur lors de la mise à jour du compte",
      data: response.data?.data
    };
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du compte :", error);
    
    if (error.response?.data) {
      const backendError = error.response.data;
      return {
        success: false,
        message: backendError.message || "Erreur lors de la mise à jour du compte",
        data: backendError.data || undefined
      };
    }
    
    return {
      success: false,
      message: error.message || "Erreur de connexion au serveur",
      data: undefined
    };
  }
};

// Add validation function for update
export const validateUpdateAccountData = (login: string, pwd: string, pwd_repeat: string, role: string): string[] => {
  const errors: string[] = [];
  
  const hasLogin = String(login || '').trim().length > 0;
  const hasRole = String(role || '').trim().length > 0;
  const hasPwd = String(pwd || '').trim().length > 0;
  const hasPwdRepeat = String(pwd_repeat || '').trim().length > 0;

  if (!hasLogin && !hasRole && !hasPwd && !hasPwdRepeat) {
    errors.push("Veuillez modifier au moins un champ");
    return errors;
  }

  if (hasPwd || hasPwdRepeat) {
    if (!hasPwd || !hasPwdRepeat) {
      errors.push("Veuillez saisir et confirmer le mot de passe");
    }

    if (hasPwd && pwd.length < 5) {
      errors.push("Le mot de passe doit contenir au moins 5 caractères");
    }

    if (hasPwd && hasPwdRepeat && pwd !== pwd_repeat) {
      errors.push("Les mots de passe ne correspondent pas");
    }
  }
  
  return errors;
};

// Create account for agent
export const createAccountAgent = async (agentId: number, telephone: number, pwd: string, pwd_repeat: string, role: string): Promise<AccountResponse> => {
  try {
    console.log('Création du compte avec les données:', { agentId, telephone, role });
    
    // Essayer avec différentes variantes de la clé agent_id
    const payload = {
      'Agent_id': agentId,  // Première tentative avec A majuscule
      'agent_id': agentId,  // Deuxième tentative avec a minuscule
      'AgentId': agentId,   // Troisième tentative en camelCase
      login: telephone.toString(),
      telephone: telephone.toString(),
      pwd: pwd,
      pwd_repeat: pwd_repeat,
      role: role,
      id_user_created: getIdUserCreated() || ''
    };

    console.log('Payload envoyé:', payload);
    
    const response = await api.post('/agent/CreateCompteAgent', {
      // Utiliser uniquement la clé qui semble fonctionner
      'Agent_id': agentId,
      login: telephone.toString(),
      telephone: telephone.toString(),
      pwd: pwd,
      pwd_repeat: pwd_repeat,
      role: role,
      id_user_created: getIdUserCreated() || ''
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => {
        // Considérer 200 et 400 comme des statuts valides
        return (status >= 200 && status < 300) || status === 400;
      }
    });

    // Vérifier si la création a réussi - check code, success, or status
    const code = response.data?.code;
    const isSuccess = code === 200 || response.status === 200 || response.data?.success === true;

    if (isSuccess) {
      return {
        success: true,
        message: response.data?.message || response.data?.msg || "Compte créé avec succès",
        data: response.data?.data
      };
    }

    // Si on arrive ici, c'est qu'il y a une erreur mais que la requête a été traitée
    return {
      success: false,
      message: response.data?.message || response.data?.msg || "Erreur lors de la création du compte",
      data: response.data?.data
    };
  } catch (error: any) {
    console.error("Erreur lors de la création du compte :", error);
    
    // Si l'API renvoie une réponse avec un message d'erreur
    if (error.response?.data) {
      const backendError = error.response.data;
      return {
        success: false,
        message: backendError.message || "Erreur lors de la création du compte",
        data: backendError.data || undefined
      };
    }
    
    // Erreur réseau ou autre erreur inattendue
    return {
      success: false,
      message: error.message || "Erreur de connexion au serveur",
      data: undefined // 
    };
  }
};

// Désactiver un compte
export const disableAccount = async (id_generate: string): Promise<AccountResponse> => {
  try {
    const response = await api.post('/agent/DisableAccount', { id_generate }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const code = response.data?.code;
    const success = code === 200;

    return {
      success,
      message: response.data?.message || (success ? 'Compte désactivé avec succès.' : 'Erreur lors de la désactivation du compte'),
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    console.error('Erreur lors de la désactivation du compte :', error);

    if (error.response?.data) {
      const backendError = error.response.data;
      return {
        success: false,
        message: backendError.message || 'Erreur lors de la désactivation du compte',
        data: backendError.data || undefined,
      };
    }

    return {
      success: false,
      message: error.message || 'Erreur de connexion au serveur',
      data: undefined,
    };
  }
};

// Activer un compte
export const enableAccount = async (id_generate: string): Promise<AccountResponse> => {
  try {
    const response = await api.post('/agent/EnableAccount', { id_generate }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const code = response.data?.code;
    const success = code === 200;

    return {
      success,
      // L'API renvoie "msg" au lieu de "message" pour le succès
      message: response.data?.msg || response.data?.message || (success ? 'Compte activé avec succès.' : "Erreur lors de l'activation du compte"),
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    console.error("Erreur lors de l'activation du compte :", error);

    if (error.response?.data) {
      const backendError = error.response.data;
      return {
        success: false,
        message: backendError.msg || backendError.message || "Erreur lors de l'activation du compte",
        data: backendError.data || undefined,
      };
    }

    return {
      success: false,
      message: error.message || "Erreur de connexion au serveur",
      data: undefined,
    };
  }
};

// Validate account data
export const validateAccountData = (agentId: number | null, telephone: number | null, pwd: string, pwd_repeat: string, role: string): string[] => {
  const errors: string[] = [];
  
  if (!agentId) {
    errors.push("Veuillez sélectionner un agent");
  }
  
  if (!telephone) {
    errors.push("Le numéro de téléphone est requis");
  }
  
  if (!pwd || pwd.length < 3) {
    errors.push("Le mot de passe doit contenir au moins 3 caractères");
  }
  
  if (pwd !== pwd_repeat) {
    errors.push("Les mots de passe ne correspondent pas");
  }
  
  if (!role) {
    errors.push("Veuillez sélectionner un rôle");
  }
  
  return errors;
};
