import { describe,it,expect } from 'vitest';
import { loginSchema,otpSchema,resourceSchema } from '../lib/validation';
import { can } from '../lib/permissions';
import { resources } from '../config/resources';
import { filterRecords } from '../mocks/filter';
import { seed } from '../mocks/data';
import type { ListParams } from '../types';
const params:ListParams={page:1,pageSize:5,search:'',status:'',module:'all',sort:'amount',order:'asc'};
describe('Frontend validation and permissions',()=>{
 it('rejects invalid email, weak passwords and malformed OTP',()=>{expect(loginSchema.safeParse({email:'incorrect',password:'123'}).success).toBe(false);expect(otpSchema.safeParse({code:'123456'}).success).toBe(true);expect(otpSchema.safeParse({code:'12345a'}).success).toBe(false);});
 it('restricts administration and finance by role',()=>{expect(can('Administrateur','admin')).toBe(true);expect(can('Finance','admin')).toBe(false);expect(can('Finance','finance')).toBe(true);expect(can('Observateur','write')).toBe(false);expect(can(undefined)).toBe(false);});
 it('validates IP addresses and CIDR masks',()=>{const valid={name:'Bureau',address:'192.168.1.0/24',entity:'TAC-Étudiant'};expect(resourceSchema(resources['ip-rules']).safeParse(valid).success).toBe(true);for(const address of ['999.1.1.1','192.168.1.1/33','192.168.1.1/foo'])expect(resourceSchema(resources['ip-rules']).safeParse({...valid,address}).success).toBe(false);});
 it('rejects negative or empty payment amounts',()=>{const valid={name:'Test étudiant',email:'test@exemple.demo',entity:'TAC-Étudiant',amount:10000,channel:'Mobile Money'};expect(resourceSchema(resources.payments).safeParse(valid).success).toBe(true);expect(resourceSchema(resources.payments).safeParse({...valid,amount:-10}).success).toBe(false);expect(resourceSchema(resources.payments).safeParse({...valid,amount:''}).success).toBe(false);});
});
describe('Combined table operations',()=>{
 const rows=seed().records.transactions;
 it('combines search, module and status before pagination',()=>{const result=filterRecords(rows,{...params,search:'Grace',module:'interurbain',status:'Réussie'});expect(result.data.every(r=>r.module==='interurbain'&&r.status==='Réussie'&&r.name.includes('Grâce'))).toBe(true);});
 it('sorts numeric values before paginating',()=>{const first=filterRecords(rows,params);const next=filterRecords(rows,{...params,page:2});expect(first.data).toHaveLength(5);expect(Number(first.data[4].amount)).toBeLessThan(Number(next.data[0].amount));expect(first.total).toBe(rows.length);});
 it('supports date ranges and empty results',()=>{const filtered=filterRecords(rows,{...params,from:'2026-11-01',to:'2026-11-03'});expect(filtered.data.every(r=>r.createdAt.slice(0,10)>='2026-11-01')).toBe(true);expect(filterRecords(rows,{...params,search:'no-such-student-xyz'}).total).toBe(0);});
});
