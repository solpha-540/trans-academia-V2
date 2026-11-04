import { http } from './http';
import type { ListParams,ListResult,RecordItem } from '../types';
export const resourceService = (resource: string) => ({
 list: async(params:ListParams)=>(await http.get<ListResult>('/resources/'+resource,{params})).data,
 create: async(data:Record<string,unknown>)=>(await http.post<RecordItem>('/resources/'+resource,data)).data,
 update: async(id:string,data:Record<string,unknown>)=>(await http.patch<RecordItem>('/resources/'+resource+'/'+id,data)).data,
 remove: async(id:string)=>{await http.delete('/resources/'+resource+'/'+id);},
 action: async(id:string,action:string)=>(await http.post<RecordItem>('/resources/'+resource+'/'+id+'/actions',{action})).data,
});
