import axios from 'axios';
import { useSession } from '../stores/session';
export const demoMode = import.meta.env.VITE_DEMO_MODE !== 'false';
export const http = axios.create({baseURL:demoMode ? '/__demo/api' : import.meta.env.VITE_FRONTEND_API_URL,timeout:15_000});
http.interceptors.request.use(config=>{ const session = useSession.getState().session; if(session) config.headers.Authorization='Bearer '+session.token; if(!demoMode && !import.meta.env.VITE_FRONTEND_API_URL) throw new Error('Configurez la couche API avant de désactiver le mode démonstration.'); return config; });
http.interceptors.response.use(response=>response,error=>{if(error.response?.status===401 && !String(error.config?.url).startsWith('/auth/')) {useSession.getState().logout();window.dispatchEvent(new Event('tac:session-expired'));}return Promise.reject(error);});
export function errorMessage(error:unknown){
 if(axios.isAxiosError(error)){
  const message=error.response?.data?.message;
  if(typeof message==='string'&&message)return message;
  if(demoMode&&(error.response?.status===404||!error.response))return 'La connexion de démonstration est indisponible. Rechargez la page avec Ctrl+F5, puis réessayez.';
  return 'Connexion impossible. Réessayez.';
 }
 return error instanceof Error?error.message:'Une erreur est survenue.';
}
