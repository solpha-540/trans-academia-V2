import React, { createContext, useContext, useEffect, useState } from "react";
import { Client, ClientPayload } from "../types/clientType";
import { getAllClients, createClient, updateClient, deleteClient } from "../components/Api/clientService";
import { toast } from "react-toastify";

type ClientContextType = {
  clients: Client[];
  loadingClients: boolean;
  errorClients: string | null;
  refreshClients: () => void;
  createNewClient: (payload: ClientPayload) => Promise<void>;
  updateExistingClient: (id: number, payload: Partial<ClientPayload>) => Promise<void>;
  deleteExistingClient: (id: number) => Promise<void>;
  creatingClient: boolean;
  createError: string | null;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [errorClients, setErrorClients] = useState<string | null>(null);
  const [creatingClient, setCreatingClient] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      setErrorClients(null);
      const data = await getAllClients();
      setClients(data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur de chargement des clients.";
      setErrorClients(errorMessage);
      console.error("Erreur lors du chargement des clients:", err);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const createNewClient = async (payload: ClientPayload) => {
    try {
      setCreatingClient(true);
      setCreateError(null);
      await createClient(payload);
      await fetchClients();
      toast.success("Client créé avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la création du client.";
      setCreateError(errorMessage);
      toast.error(errorMessage);
      console.error("Erreur lors de la création du client:", err);
      throw err;
    } finally {
      setCreatingClient(false);
    }
  };

  const updateExistingClient = async (id: number, payload: Partial<ClientPayload>) => {
    try {
      setCreatingClient(true);
      await updateClient(id, payload);
      await fetchClients();
      toast.success("Client mis à jour avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la mise à jour du client.";
      toast.error(errorMessage);
      console.error("Erreur lors de la mise à jour du client:", err);
      throw err;
    } finally {
      setCreatingClient(false);
    }
  };

  const deleteExistingClient = async (id: number) => {
    try {
      setCreatingClient(true);
      await deleteClient(id);
      await fetchClients();
      toast.success("Client supprimé avec succès !");
    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || "Erreur lors de la suppression du client.";
      toast.error(errorMessage);
      console.error("Erreur lors de la suppression du client:", err);
      throw err;
    } finally {
      setCreatingClient(false);
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        loadingClients,
        errorClients,
        refreshClients: fetchClients,
        createNewClient,
        updateExistingClient,
        deleteExistingClient,
        creatingClient,
        createError,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClientContext doit être utilisé dans un ClientProvider");
  }
  return context;
};