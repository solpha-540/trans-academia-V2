import { resourceService } from './resource';
import { http } from './http';
export const operationsServices = Object.fromEntries(['tickets','monitoring'].map(key=>[key,resourceService(key)]));
export const getDashboard = async (module:string,period:string) => (await http.get('/dashboard',{params:{module,period}})).data;
export const getSettings = async () => (await http.get('/settings')).data;
export const saveSettings = async (data:Record<string,unknown>) => (await http.patch('/settings',data)).data;
export const resetDemo = async () => { await http.post('/reset'); };
