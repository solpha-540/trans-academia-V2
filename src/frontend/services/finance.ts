import { resourceService } from './resource';
import { http } from './http';
export const financeServices = Object.fromEntries(['transactions','payments','reconciliation'].map(key=>[key,resourceService(key)]));
export const simulateCardPayment = async (data:Record<string,unknown>) => (await http.post('/card-payment',data)).data;
