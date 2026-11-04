import api from './axiosConfig';
import { AccountPayload, Account } from '../../types/accountType';
import { Agent } from '../../types/agentType';
import { getIdUserCreated } from '../../utils/auth';

// 🔧 Gestion des erreurs backend
const handleBackendError = (error: any): never => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  } else if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  } else if (error.message) {
    throw new Error(error.message);
  } else {
    throw new Error('Une erreur inattendue s\'est produite');
  }
};

// 📝 Validation des données de compte
export const validateAccountData = (data: AccountPayload): string[] => {
  const errors: string[] = [];
  
  // Validation des champs requis
  const requiredFields = [
    { field: 'Agent_id', name: 'Agent' },
    { field: 'login', name: 'Login' },
    { field: 'pwd', name: 'Mot de passe' },
    { field: 'pwd_repeat', name: 'Confirmation du mot de passe' }
  ];
  
  requiredFields.forEach(({ field, name }) => {
    if (!data[field as keyof AccountPayload] || data[field as keyof AccountPayload] === '') {
      errors.push(`${name} est requis`);
    }
  });
  
  // Validation du login
  if (data.login && data.login.length < 3) {
    errors.push('Le login doit contenir au moins 3 caractères');
  }
  
  // Validation du mot de passe
  if (data.pwd && data.pwd.length < 5) {
    errors.push('Le mot de passe doit contenir au moins 5 caractères');
  }
  
  // Validation de la confirmation du mot de passe
  if (data.pwd !== data.pwd_repeat) {
    errors.push('Les mots de passe ne correspondent pas');
  }
  
  // Validation de l'ID agent
  if (data.agentId && data.agentId <= 0) {
    errors.push('Veuillez sélectionner un agent valide');
  }
  
  return errors;
};

// 🔄 Formatage des données pour l'API
export const formatAccountData = (data: AccountPayload): AccountPayload => {
  const id_user_created = getIdUserCreated();
  
  return {
    agentId: Number(data.agentId),
    login: data.login.trim(),
    pwd: data.pwd,
    pwd_repeat: data.pwd_repeat,
    id_user_created: id_user_created || data.id_user_created
  };
};

// 🆕 Création d'un nouveau compte
export const createAccount = async (accountData: AccountPayload): Promise<Account> => {
  try {
    // Validation des données
    const validationErrors = validateAccountData(accountData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }
    
    // Formatage des données
    const formattedData = formatAccountData(accountData);
    
    // Appel API
    const response = await api.post('/agent/CreateCompteAgent', formattedData);
    
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    return handleBackendError(error);
  }
};

// 🔁 Récupération de la liste des agents
export const getAgentsForAccount = async (): Promise<Agent[]> => {
  try {
    const response = await api.get('/agent/ListeAgent');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des agents:', error);
    return handleBackendError(error);
  }
};

// 🔁 Récupération de la liste des comptes (si nécessaire)
export const getAccounts = async (): Promise<Account[]> => {
  try {
    const response = await api.get('/agent/ListeCompte'); // Assuming this endpoint exists
    return response.data.data || response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes:', error);
    return handleBackendError(error);
  }
};