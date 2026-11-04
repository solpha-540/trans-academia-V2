import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login as authLogin, logout as authLogout, isAuthenticated, getAuthToken, getRefreshToken, getUserInfo, getIdUserCreated, UserType, getRole } from '../utils/auth';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: any;
  id_user_created: string | null;   // <-- Ajoute cette ligne
  role: string | null;
  login: (tokens: { accessToken: string; refreshToken: string; userInfo: any; id_user_created: string; role: string; agent_id?: string | number }, additionalData?: Record<string, any>) => void;
  logout: () => void;
  loading: boolean;
  token: string | null;
  refreshToken: string | null;
}

const useAuth = (userType: UserType = 'admin'): UseAuthReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [id_user_created, setIdUserCreated] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const checkAuth = () => {
      const authToken = getAuthToken();
      const refresh = getRefreshToken();
      const userInfo = getUserInfo();
      const role = getRole();
      const id_user_created = getIdUserCreated();
      
      setToken(authToken);
      setRefreshToken(refresh);
      setUser(userInfo);
      setIdUserCreated(id_user_created);
      setRole(role);
      setLoading(false);
    };

    checkAuth();
    
    // Listen for storage events to sync auth state across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'userInfo') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback((tokens: {
    accessToken: string;
    refreshToken: string;
    userInfo: any;
    id_user_created: string;
    role: string;
    agent_id?: string | number;
  }, additionalData?: Record<string, any>) => {
    try {
      // Call the auth utility function with correct parameters
      authLogin({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userInfo: tokens.userInfo,
        id_user_created: tokens.id_user_created,
        role: tokens.role,
        agent_id: tokens.agent_id
      }, additionalData);
      
      // Update local state
      setToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      setUser(tokens.userInfo);
      setIdUserCreated(tokens.id_user_created);
      setRole(tokens.role);
      
      // Redirection spécifique selon le rôle
      let redirectPath = '/dashboard/hrm';
      const userRole = tokens.role;
      
      if (userRole === 'CHEF BUREAU PAIE') {
        redirectPath = '/dashboard/home/chef-carriere';
      } else if (userRole === 'CHEF CARRIERE') {
        redirectPath = '/dashboard/home/chef-carriere';
      } else if (userRole === 'CHEF PERSONNEL') {
        redirectPath = '/dashboard/home/admin';
      } else if (userRole === 'DRH') {
        redirectPath = '/dashboard/home/drh';
      } else if (userRole === 'DG') {
        redirectPath = '/dashboard/home/dg';
      }
      
      navigate(redirectPath);
      
      toast.success('Connexion réussie');
      console.log('✅ Login successful for user type:', userType);
      
      // Déclencher un événement pour recharger les données après connexion
      window.dispatchEvent(new CustomEvent('auth:login', { 
        detail: { userType, userInfo: tokens.userInfo } 
      }));
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('Erreur lors de la connexion');
      throw error;
    }
  }, [navigate, userType]);

  const logout = useCallback(() => {
    try {
      // Call auth utility logout function
      authLogout(userType);
      
      // Clear all local state
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setIdUserCreated(null);
      setRole(null);
      
      // Déclencher un événement pour nettoyer les données après déconnexion
      window.dispatchEvent(new CustomEvent('auth:logout', { 
        detail: { userType } 
      }));
      
      // Redirect to appropriate login page
      const loginPath = userType === 'admin' ? '/admin' : '/';
      navigate(loginPath);
      
      console.log('✅ Logout successful for user type:', userType);
    } catch (error) {
      console.error('❌ Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  }, [navigate, userType]);

  return {
    isAuthenticated: isAuthenticated(),
    user,
    id_user_created,
    role,
    login,
    logout,
    loading,
    token,
    refreshToken,
  };
};

export default useAuth;
