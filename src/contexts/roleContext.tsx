import React, { createContext, useContext, useEffect, useState } from "react";
import { Role, RolePayload } from "../types/role";
import {
  getRoles,
  createRole as apiCreateRole,
  updateRole as apiUpdateRole,
  deleteRole as apiDeleteRole,
} from "../components/Api/roleService";

interface RoleContextType {
  roles: Role[];
  loading: boolean;
  error: string | null;
  createRole: (payload: RolePayload) => Promise<void>;
  updateRoleData: (id: number, payload: { libelle: string }) => Promise<void>;
  deleteRoleData: (id: number) => Promise<void>;
  refreshRoles: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshRoles = async () => {
    setLoading(true);
    try {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la récupération des rôles:", error);
      setError((error as any)?.message || "Erreur lors de la récupération des rôles.");
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (payload: RolePayload) => {
    try {
      setLoading(true);
      await apiCreateRole(payload);
      await refreshRoles();
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la création du rôle.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRoleData = async (id: number, payload: { libelle: string }) => {
    try {
      setLoading(true);
      await apiUpdateRole(id, payload);
      await refreshRoles();
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la mise à jour du rôle.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoleData = async (id: number) => {
    try {
      setLoading(true);
      await apiDeleteRole(id);
      await refreshRoles();
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la suppression du rôle.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRoles();
  }, []);

  return (
    <RoleContext.Provider
      value={{
        roles,
        loading,
        error,
        createRole,
        updateRoleData,
        deleteRoleData,
        refreshRoles,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
};

