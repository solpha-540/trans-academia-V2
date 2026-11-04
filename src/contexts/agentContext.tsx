import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import { Agent, Specimen } from "../types/agentType";
import { HistoriqueAdresseAgent } from "../types/adresseType";
import type { UserRoleCount } from "../types/role";
import { 
  getAgents, 
  agentPrintStatus,
  type AgentPrintStatusResponse,
  getPrintedAgentCards,
  type PrintedAgentCard,
  getHistoriqueAdresseAgent, 
  getSpecimenCard,
  getUsersCountByRole,
  updateAgentPhoto,
  updateCardStatus,
  type CardStatusValue,
  type UpdateCardStatusResponse,
} from "../components/Api/agentService";

type AgentContextType = {
  agents: Agent[];
  filteredAgents: Agent[];
  unassignedAgents: Agent[];
  unassignedAgentsCount: number;
  adressesAgents: HistoriqueAdresseAgent[];
  usersByRole: UserRoleCount[];
  printedAgentCards: PrintedAgentCard[];
  totalUsers: number;
  loading: boolean;
  loadingAdresses: boolean;
  loadingSpecimen: boolean;
  loadingUsersByRole: boolean;
  loadingPrintedAgentCards: boolean;
  error: string | null;
  errorAdresses: string | null;
  errorSpecimen: string | null;
  errorUsersByRole: string | null;
  errorPrintedAgentCards: string | null;
  searchTerm: string;
  specimenCard: Specimen | null;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  refreshAgents: () => Promise<void>;
  refreshAdresses: () => Promise<void>;
  refreshUsersByRole: () => Promise<void>;
  refreshPrintedAgentCards: () => Promise<void>;
  fetchSpecimenCard: () => Promise<void>;
  clearSpecimenCard: () => void;
  updateAgentPhoto: (agentId: number, photoFile: File) => Promise<{ success: boolean; message: string; data?: any }>;
  agentPrintStatus: (agentId: number) => Promise<AgentPrintStatusResponse>;
  updateCardStatus: (idCard: string, statusImpression: CardStatusValue) => Promise<UpdateCardStatusResponse>;
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [adressesAgents, setAdressesAgents] = useState<HistoriqueAdresseAgent[]>([]);
  const [usersByRole, setUsersByRole] = useState<UserRoleCount[]>([]);
  const [printedAgentCards, setPrintedAgentCards] = useState<PrintedAgentCard[]>([]);
  const [specimenCard, setSpecimenCard] = useState<Specimen | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAdresses, setLoadingAdresses] = useState<boolean>(false);
  const [loadingSpecimen, setLoadingSpecimen] = useState<boolean>(false);
  const [loadingUsersByRole, setLoadingUsersByRole] = useState<boolean>(false);
  const [loadingPrintedAgentCards, setLoadingPrintedAgentCards] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);
  const [errorAdresses, setErrorAdresses] = useState<string | null>(null);
  const [errorSpecimen, setErrorSpecimen] = useState<string | null>(null);
  const [errorUsersByRole, setErrorUsersByRole] = useState<string | null>(null);
  const [errorPrintedAgentCards, setErrorPrintedAgentCards] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await getAgents();
      setAgents(data);
      setError(null);
    } catch (err: any) {
      setError("Erreur de chargement des agents.");
      console.error("Erreur fetchAgents:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdresses = async () => {
    try {
      setLoadingAdresses(true);
      const data = await getHistoriqueAdresseAgent();
      setAdressesAgents(data);
      setErrorAdresses(null);
    } catch (err: any) {
      setErrorAdresses("Erreur de chargement des adresses.");
      console.error("Erreur fetchAdresses:", err);
    } finally {
      setLoadingAdresses(false);
    }
  };

  const fetchUsersByRole = async () => {
    try {
      setLoadingUsersByRole(true);
      setErrorUsersByRole(null);
      const data = await getUsersCountByRole();
      setUsersByRole(data);
    } catch (err: any) {
      setErrorUsersByRole(err.message || "Erreur de chargement des utilisateurs par rôle.");
      setUsersByRole([]);
      console.error("Erreur fetchUsersByRole:", err);
    } finally {
      setLoadingUsersByRole(false);
    }
  };

  const fetchSpecimenCard = async () => {
    try {
      setLoadingSpecimen(true);
      setErrorSpecimen(null);
      const specimen = await getSpecimenCard();
      setSpecimenCard(specimen);
    } catch (err: any) {
      setErrorSpecimen(err.message || "Erreur de chargement de la carte specimen.");
      setSpecimenCard(null);
      console.error("Erreur fetchSpecimenCard:", err);
    } finally {
      setLoadingSpecimen(false);
    }
  };

  const clearSpecimenCard = () => {
    setSpecimenCard(null);
    setErrorSpecimen(null);
  };

  const handleUpdateAgentPhoto = async (agentId: number, photoFile: File): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const result = await updateAgentPhoto(agentId, photoFile);
      if (result.success) {
        await fetchAgents();
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo:', error);
      if (error instanceof Response) {
        error.clone().json().then(data => console.error('Réponse API:', data));
      }
      return {
        success: false,
        message: 'Erreur lors de la mise à jour de la photo'
      };
    }
  };

  const fetchPrintedAgentCards = async () => {
    try {
      setLoadingPrintedAgentCards(true);
      setErrorPrintedAgentCards(null);
      const data = await getPrintedAgentCards();
      setPrintedAgentCards(data);
    } catch (err: any) {
      setErrorPrintedAgentCards(err.message || 'Erreur de chargement des cartes imprimées.');
      setPrintedAgentCards([]);
      console.error('Erreur fetchPrintedAgentCards:', err);
    } finally {
      setLoadingPrintedAgentCards(false);
    }
  };

  const handleAgentPrintStatus = async (agentId: number): Promise<AgentPrintStatusResponse> => {
    return agentPrintStatus(agentId);
  };

  const handleUpdateCardStatus = async (
    idCard: string,
    statusImpression: CardStatusValue,
  ): Promise<UpdateCardStatusResponse> => {
    const response = await updateCardStatus(idCard, statusImpression);
    const normalizedId = idCard.trim();

    setPrintedAgentCards((prev) =>
      prev.map((card) => {
        if (card.codeGenerateTac?.trim() !== normalizedId) {
          return card;
        }

        return {
          ...card,
          status_carte: response.data.status_carte,
          statusImpression: response.data.status_carte,
        };
      }),
    );

    return response;
  };

  useEffect(() => {
    fetchAgents();
    fetchAdresses();
    fetchUsersByRole();
  }, []);

  useEffect(() => {
    const handleAuthLogin = () => {
      console.log('🔄 Auth login detected - refreshing agent data...');
      fetchAgents();
      fetchAdresses();
      fetchUsersByRole();
    };

    const handleAuthLogout = () => {
      console.log('🧹 Auth logout detected - clearing agent data...');
      setAgents([]);
      setAdressesAgents([]);
      setUsersByRole([]);
      setPrintedAgentCards([]);
      setSpecimenCard(null);
    };

    window.addEventListener('auth:login', handleAuthLogin);
    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:login', handleAuthLogin);
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  const clearSearch = () => setSearchTerm("");

  const filteredAgents = useMemo(() => {
    if (!searchTerm.trim()) return agents;
    const termLower = searchTerm.toLowerCase();
    return agents.filter(
      (agent) =>
        agent.nom?.toLowerCase().includes(termLower) ||
        agent.prenom?.toLowerCase().includes(termLower) ||
        agent.matricule?.toLowerCase().includes(termLower) ||
        agent.fonctionLibelle?.toLowerCase().includes(termLower) ||
        agent.gradeLibelle?.toLowerCase().includes(termLower) ||
        agent.email?.toLowerCase().includes(termLower) ||
        agent.telephone_un?.toString().includes(termLower)
    );
  }, [agents, searchTerm]);

  const unassignedAgents = useMemo(() => {
    return agents.filter(agent => 
      (!agent.serviceLibelle || agent.serviceLibelle.trim() === '') && 
      (!agent.directionLibelle || agent.directionLibelle.trim() === '')
    );
  }, [agents]);
  
  const unassignedAgentsCount = useMemo(() => unassignedAgents.length, [unassignedAgents]);

  const totalUsers = useMemo(() => {
    return usersByRole.reduce((acc, role) => acc + role.nombre_utilisateurs, 0);
  }, [usersByRole]);

  return (
    <AgentContext.Provider
      value={{
        agents,
        filteredAgents,
        unassignedAgents,
        unassignedAgentsCount,
        adressesAgents,
        usersByRole,
        printedAgentCards,
        totalUsers,
        specimenCard,
        loading,
        loadingAdresses,
        loadingSpecimen,
        loadingUsersByRole,
        loadingPrintedAgentCards,
        error,
        errorAdresses,
        errorSpecimen,
        errorUsersByRole,
        errorPrintedAgentCards,
        searchTerm,
        setSearchTerm,
        clearSearch,
        refreshAgents: fetchAgents,
        refreshAdresses: fetchAdresses,
        refreshUsersByRole: fetchUsersByRole,
        refreshPrintedAgentCards: fetchPrintedAgentCards,
        fetchSpecimenCard,
        clearSpecimenCard,
        updateAgentPhoto: handleUpdateAgentPhoto,
        agentPrintStatus: handleAgentPrintStatus,
        updateCardStatus: handleUpdateCardStatus,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) throw new Error("useAgentContext doit être utilisé dans AgentProvider");
  return context;
};
