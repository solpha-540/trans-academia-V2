import { isAxiosError } from 'axios';
import { http,demoMode } from './http';
import type { Session } from '../types';

async function login(data:{email:string;password:string}):Promise<{challenge:string}>{
  const send=async()=>(await http.post<{challenge:string}>('/auth/login',data)).data;
  try{return await send();}catch(error){
    const unavailable=demoMode&&isAxiosError(error)&&(
      error.response?.status===404||
      (!error.response&&['ERR_NETWORK','ECONNABORTED','ETIMEDOUT'].includes(error.code||''))
    );
    if(!unavailable)throw error;
    try{
      const {recoverDemoConnection}=await import('../mocks/browser');
      await recoverDemoConnection();
    }catch{
      throw new Error('Impossible de réactiver la connexion de démonstration. Rechargez la page avec Ctrl+F5.');
    }
    // Une seule nouvelle tentative : aucune boucle, aucun renvoi sur erreur d’identifiants.
    return send();
  }
}

export const authService={
  login,
  verify:async(challenge:string,code:string)=>(await http.post<Session>('/auth/verify',{challenge,code})).data,
  resend:async(challenge:string)=>(await http.post<{challenge:string}>('/auth/resend',{challenge})).data,
  logout:async()=>{await http.post('/auth/logout');},
};
