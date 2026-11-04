import { z } from 'zod';
import type { ResourceConfig } from '../types';
export const loginSchema = z.object({ email: z.string().email('Saisissez une adresse e-mail valide.'), password: z.string().min(8,'Le mot de passe doit contenir au moins 8 caractères.') });
export const otpSchema = z.object({ code: z.string().regex(/^\d{6}$/,'Saisissez les 6 chiffres du code.') });
export function resourceSchema(config: ResourceConfig) {
 const shape: Record<string,z.ZodTypeAny> = {};
 for (const field of config.fields) {
  if (field.type === 'number') shape[field.key] = z.preprocess(value => value === '' ? Number.NaN : value, z.coerce.number({invalid_type_error:'Saisissez un nombre.'}).min(field.key === 'rate' || field.key === 'duration' ? 1 : 0,'Le montant doit être positif.').max(1_000_000_000));
  else if (field.type === 'email') shape[field.key] = z.string().email('Adresse e-mail invalide.');
  else if (field.type === 'select') shape[field.key] = z.enum(field.options as [string,...string[]]);
  else if (field.type === 'date') shape[field.key] = z.string().regex(/^\d{4}-\d{2}-\d{2}$/,'Choisissez une date.');
  else if (field.key === 'address') shape[field.key] = z.string().refine(value => { const [ip,mask,...rest]=value.split('/');return !rest.length && /^\d+\.\d+\.\d+\.\d+$/.test(ip) && ip.split('.').every(n=>+n>=0 && +n<=255) && (mask===undefined || /^\d+$/.test(mask) && +mask<=32); },'Adresse IPv4 ou CIDR invalide.');
  else shape[field.key] = z.string().trim().min(2,'Au moins 2 caractères.').max(field.type === 'textarea' ? 1500 : 150);
 }
 return z.object(shape);
}
