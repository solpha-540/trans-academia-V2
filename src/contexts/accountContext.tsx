import { createContext, useContext, useState, ReactNode } from 'react';
import { Agent } from '../types/agentType';
import { Account, AccountList, AccountResponse } from '../types/accountType';
import { fetchAgents, createAccountAgent, validateAccountData, fetchAccountsList, enableAccount, disableAccount, updateAccountAgent, validateUpdateAccountData } from '../components/Api/accountService';

interface AccountContextType {
  // State
  agents: Agent[];
  selectedAgent: Agent | null;
  accounts: Account[];
  accountsList: AccountList[];
  loading: boolean;
  loadingAccountsList: boolean;
  error: string | null;
  success: string | null;
  
  // Actions
  loadAgents: () => Promise<void>;
  loadAccountsList: () => Promise<void>;
  selectAgent: (agent: Agent | null) => void;
  createAccount: (agentId: number, telephone: number, pwd: string, pwd_repeat: string, role: string) => Promise<AccountResponse>;
  clearMessages: () => void;
  searchAgents: (searchTerm: string) => Agent[];
  searchAccountsList: (searchTerm: string) => AccountList[];
  activateAccount: (id_generate: string) => Promise<void>;
  deactivateAccount: (id_generate: string) => Promise<void>;
  updateAccount: (agentId: number, login: string, pwd: string, pwd_repeat: string, role: string) => Promise<AccountResponse>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within a AccountProvider');
  }
  return context;
};

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsList, setAccountsList] = useState<AccountList[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAccountsList, setLoadingAccountsList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const ACCOUNT_CREATED_MESSAGE = "Votre compte a été créé. Veuillez vous connecter";

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const loadAgents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const agentsData = await fetchAgents();
      setAgents(agentsData);
    } catch (err) {
      setError('Erreur lors du chargement des agents');
      console.error('Error loading agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (agentId: number, login: string, pwd: string, pwd_repeat: string, role: string): Promise<AccountResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const validationErrors = validateUpdateAccountData(login, pwd, pwd_repeat, role);
      if (validationErrors.length > 0) {
        const msg = validationErrors.join(', ');
        setError(msg);
        return { success: false, message: msg, data: undefined };
      }

      const response: AccountResponse = await updateAccountAgent(agentId, login, pwd, pwd_repeat, role);
      if (response.success) {
        setSuccess(response.message);
        await loadAccountsList();
      } else {
        setError(response.message);
      }

      return response;
    } catch (err: any) {
      const msg = err?.message || 'Erreur lors de la mise à jour du compte';
      setError(msg);
      console.error('Error updating account:', err);
      return { success: false, message: msg, data: undefined };
    } finally {
      setLoading(false);
    }
  };

  const loadAccountsList = async () => {
    setLoadingAccountsList(true);
    setError(null);
    
    try {
      const accountsData = await fetchAccountsList();
      setAccountsList(accountsData);
    } catch (err) {
      setError('Erreur lors du chargement des comptes');
      console.error('Error loading accounts list:', err);
    } finally {
      setLoadingAccountsList(false);
    }
  };

  const selectAgent = (agent: Agent | null) => {
    setSelectedAgent(agent);
    clearMessages();
  };

  const createAccount = async (agentId: number, telephone: number, pwd: string, pwd_repeat: string, role: string): Promise<AccountResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate data
      const validationErrors = validateAccountData(agentId, telephone, pwd, pwd_repeat, role);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return { success: false, message: validationErrors.join(', '), data: undefined };
      }

      // Create compte
      const response: AccountResponse = await createAccountAgent(agentId, telephone, pwd, pwd_repeat, role);
      
      const backendMessage = String(response.message || "");
      const backendSaysCreated = backendMessage.toLowerCase().includes("compte") &&
        (backendMessage.toLowerCase().includes("cré") || backendMessage.toLowerCase().includes("cree"));

      if (response.success || backendSaysCreated) {
        setError(null);
        setSuccess(ACCOUNT_CREATED_MESSAGE);
        if (response.data) {
          setAccounts(prev => [...prev, response.data!]);
        }
        setSelectedAgent(null); // Clear selection after successful creation
        // Reload accounts list to show the new account
        await loadAccountsList();

        return { ...response, success: true };
      } else {
        setError(response.message);
        return { ...response, success: false };
      }
    } catch (err) {
      setError('Erreur lors de la création du compte');
      console.error('Error creating compte:', err);
      return { success: false, message: 'Erreur lors de la création du compte', data: undefined };
    } finally {
      setLoading(false);
    }
  };

  const searchAgents = (searchTerm: string): Agent[] => {
    if (!searchTerm.trim()) return agents;
    
    const term = searchTerm.toLowerCase();
    return agents.filter(agent => 
      (agent.nom?.toLowerCase() || '').includes(term) ||
      (agent.prenom?.toLowerCase() || '').includes(term) ||
      (agent.telephone_un?.toString() || '').includes(term)
    );
  };

  const searchAccountsList = (searchTerm: string): AccountList[] => {
    if (!searchTerm.trim()) return accountsList;
    
    const term = searchTerm.toLowerCase();
    return accountsList.filter(account => 
      (account.nomCompletAgent?.toLowerCase() || '').includes(term) ||
      (account.login?.toLowerCase() || '').includes(term) ||
      (account.roleLibelle?.toLowerCase() || '').includes(term) ||
      (account.id_generate?.toLowerCase() || '').includes(term)
    );
  };

  const activateAccount = async (id_generate: string) => {
    setLoadingAccountsList(true);
    setError(null);
    setSuccess(null);

    try {
      const response: AccountResponse = await enableAccount(id_generate);
      if (response.success) {
        setSuccess(response.message);
        await loadAccountsList();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Erreur lors de l'activation du compte");
      console.error("Error activating account:", err);
    } finally {
      setLoadingAccountsList(false);
    }
  };

  const deactivateAccount = async (id_generate: string) => {
    setLoadingAccountsList(true);
    setError(null);
    setSuccess(null);

    try {
      const response: AccountResponse = await disableAccount(id_generate);
      if (response.success) {
        setSuccess(response.message);
        await loadAccountsList();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Erreur lors de la désactivation du compte');
      console.error('Error deactivating account:', err);
    } finally {
      setLoadingAccountsList(false);
    }
  };

  const value: AccountContextType = {
    agents,
    selectedAgent,
    accounts,
    accountsList,
    loading,
    loadingAccountsList,
    error,
    success,
    loadAgents,
    loadAccountsList,
    selectAgent,
    createAccount,
    clearMessages,
    searchAgents,
    searchAccountsList,
    activateAccount,
    deactivateAccount,
    updateAccount
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};
