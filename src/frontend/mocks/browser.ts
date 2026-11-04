import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { demoMode } from '../services/http';

export const worker=setupWorker(...handlers);
let starting:Promise<unknown>|undefined;
let recovering:Promise<void>|undefined;

export async function startDemo():Promise<void>{
  if(!demoMode)return;
  if(!starting){
    starting=worker.start({
      serviceWorker:{
        url:import.meta.env.BASE_URL+'mockServiceWorker.js?tac-demo=v2',
        options:{scope:import.meta.env.BASE_URL,updateViaCache:'none'},
      },
      onUnhandledRequest:'bypass',
      quiet:true,
    }).catch(error=>{starting=undefined;throw error;});
  }
  await starting;
}

// Reconnecte uniquement le simulateur de cette application, sans effacer les données.
export async function recoverDemoConnection():Promise<void>{
  if(!demoMode)return;
  if(!recovering){
    recovering=(async()=>{
      await starting?.catch(()=>undefined);
      worker.stop();
      starting=undefined;
      await startDemo();
    })();
  }
  try{await recovering;}finally{recovering=undefined;}
}
