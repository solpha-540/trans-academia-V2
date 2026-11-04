import { interUrbainService } from './interurbain';
import { kelasiService } from './kelasi';
import { etudiantService } from './etudiant';
import { getDashboard } from '../operations';
const moduleServices={interurbain:interUrbainService,kelasi:kelasiService,etudiant:etudiantService};
export function getModuleDashboard(module:string,period:string){return module in moduleServices?moduleServices[module as keyof typeof moduleServices].dashboard(period):getDashboard('all',period);}
