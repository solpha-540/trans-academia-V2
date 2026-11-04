import { toast } from 'react-toastify';
import { getDecryptedItem, removeStoredItem, setEncryptedItem } from './secureStorage';

export type UserType = 'admin' | 'agent';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  userInfo: any;
  id_user_created: string;
  role: string;
  agent_id?: string | number;
  agent_i?: string | number;
};

// Login function to store authentication data for both admin and agent
export const login = (tokens: AuthTokens, additionalData?: Record<string, any>): void => {
  try {
    // Store core authentication data
    setEncryptedItem('accessToken', tokens.accessToken);
    setEncryptedItem('refreshToken', tokens.refreshToken);
    setEncryptedItem('userInfo', tokens.userInfo);
    setEncryptedItem('id_user_created', tokens.id_user_created);
    setEncryptedItem('role', tokens.role);

    if (additionalData?.userType === 'admin' || additionalData?.userType === 'agent') {
      setEncryptedItem('userType', additionalData.userType);
    }

    const agentId = tokens.agent_id ?? tokens.agent_i;
    if (agentId !== undefined && agentId !== null) {
      setEncryptedItem('agent_id', String(agentId));
    }

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        setEncryptedItem(key, typeof value === 'string' ? value : value);
      });
    }
    
    console.log('✅ Authentication data stored successfully');

    window.dispatchEvent(new Event("auth:login"));
  } catch (error) {
    console.error('❌ Error storing authentication data:', error);
    throw new Error('Failed to store authentication data');
  }
};

// Logout function that handles both admin and agent scenarios
export const logout = (
  userType: UserType = 'admin',
  options?: {
    silent?: boolean;
  }
): void => {
  try {
    const hadSession = !!localStorage.getItem('accessToken') || !!localStorage.getItem('refreshToken');

    // Clear all auth-related items from localStorage
    removeStoredItem('accessToken');
    removeStoredItem('refreshToken');
    removeStoredItem('userInfo');
    removeStoredItem('id_user_created');
    removeStoredItem('agent_id');
    removeStoredItem('role');
    removeStoredItem('userType');

    // Show success message
    if (hadSession && !options?.silent) {
      toast.success('Déconnexion réussie', { toastId: 'logout-success' });
    }
    
    // Note: Navigation should be handled by the component calling this function
    // since useNavigate hook cannot be used in utility functions
    console.log('✅ Logout successful for user type:', userType);
  } catch (error) {
    console.error('❌ Error during logout:', error);
    toast.error('Une erreur est survenue lors de la déconnexion');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

// Get access token
export const getAuthToken = (): string | null => {
  return getDecryptedItem<string>('accessToken');
};

// Get refresh token
export const getRefreshToken = (): string | null => {
  return getDecryptedItem<string>('refreshToken');
};

// Get user info
export const getUserInfo = (): any => {
  return getDecryptedItem<any>('userInfo');
};

// Get user created ID
export const getIdUserCreated = (): string | null => {
  return getDecryptedItem<string>('id_user_created');
};

// Get user role
export const getUserRole = (): string | null => {
  return getDecryptedItem<string>('role');
};

// Alias for getUserRole for backward compatibility
export const getRole = (): string | null => {
  return getUserRole();
};

export const getAgentId = (): string | null => {
  return getDecryptedItem<string>('agent_id');
};

export const getUserType = (): UserType | null => {
  const value = getDecryptedItem<string>('userType');
  if (value === 'admin' || value === 'agent') return value;
  return null;
};
