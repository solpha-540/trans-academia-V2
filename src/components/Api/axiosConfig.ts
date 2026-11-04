import axios from 'axios';
import { getAuthToken, getUserType, logout } from '../../utils/auth';
import { toast } from 'react-toastify';

// Création de l'instance axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL.endsWith('/')
    ? import.meta.env.VITE_API_URL
    : `${import.meta.env.VITE_API_URL}/`,
  timeout: 10000, // Timeout de 10 secondes
});

// Intercepteur de requête pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    config.headers = config.headers || {};
    if (token) {
      config.headers['Authorizations'] = `tac ${token}`;
    }
    console.log('[axiosConfig] Sending request', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      hasAuthorization: !!config.headers?.['Authorizations'],
      authorizationHeader: config.headers?.['Authorizations'],
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isSessionExpiredHandling = false;

// Intercepteur de réponse unique pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const token = getAuthToken();

    const status = error.response?.status;
    const requestUrl: string = originalRequest?.url || '';
    const isAuthEndpoint = requestUrl.includes('/auth/loginAdmin') || requestUrl.includes('/user/agent');

    // Si l'erreur est 401/403 (token expiré/invalide)
    if (token && (status === 401 || status === 403) && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Ici, vous pouvez ajouter une logique de rafraîchissement de token si nécessaire
        // Par exemple :
        // const newToken = await refreshToken();
        // if (newToken) {
        //   setAuthToken(newToken);
        //   originalRequest.headers['Authorization'] = `tac ${newToken}`;
        //   return api(originalRequest);
        // }

        toast.info('Session expirée, veuillez vous reconnecter', {
          toastId: 'session-expired',
          autoClose: 3000,
        });

        if (!isSessionExpiredHandling) {
          isSessionExpiredHandling = true;
          const userType = getUserType() || 'agent';
          logout(userType, { silent: true });
          const redirectPath = userType === 'admin' ? '/admin' : '/';
          window.location.assign(redirectPath);
        }
        return Promise.reject(error);
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token:', refreshError);
        toast.info('Session expirée, veuillez vous reconnecter', {
          toastId: 'session-expired',
          autoClose: 3000,
        });

        if (!isSessionExpiredHandling) {
          isSessionExpiredHandling = true;
          const userType = getUserType() || 'agent';
          logout(userType, { silent: true });
          const redirectPath = userType === 'admin' ? '/admin' : '/';
          window.location.assign(redirectPath);
        }
        return Promise.reject(refreshError);
      }
    }

    // Gestion des autres types d'erreurs
    if (error.response) {
      // Erreurs avec réponse du serveur (4xx, 5xx)
      console.error('[axiosConfig] Erreur de réponse du serveur:', {
        requestUrl,
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Aucune réponse reçue
      console.error('[axiosConfig] Aucune réponse du serveur:', {
        requestUrl,
        request: error.request,
      });
    } else {
      // Erreur de configuration de la requête
      console.error('[axiosConfig] Erreur de configuration de la requête:', {
        requestUrl,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);
      
export default api;