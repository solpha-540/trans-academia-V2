// hooks/useUserRoles.ts

import { useState, useEffect } from 'react';
import { getUsersCountByRole } from '../components/Api/agentService';
import { UserRoleCount } from '../types/role';

interface UseUserRolesReturn {
  userRoles: UserRoleCount[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useUserRoles = (): UseUserRolesReturn => {
  const [userRoles, setUserRoles] = useState<UserRoleCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsersCountByRole();
      setUserRoles(data);
      console.log('✅ Données chargées dans le hook:', data);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement des données');
      console.error('❌ Erreur dans useUserRoles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    userRoles,
    loading,
    error,
    refresh: fetchData
  };
};