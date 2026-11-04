import { getDashboard } from '../operations';
import { resourceService } from '../resource';
import type { ListParams,Module } from '../../types';
export function createModuleService(module:Exclude<Module,'all'>){return {dashboard:(period:string)=>getDashboard(module,period),resource:(key:string)=>{const service=resourceService(key);return {...service,list:(params:ListParams)=>service.list({...params,module}),create:(data:Record<string,unknown>)=>service.create({...data,module})};}};}
