import { describe,it,expect } from 'vitest';
import { loginSchema,otpSchema,resourceSchema } from '../lib/validation';
import { can } from '../lib/permissions';
import { modules,resources } from '../config/resources';
import { filterRecords } from '../mocks/filter';
import { seed } from '../mocks/data';
import type { ListParams } from '../types';
const params:ListParams={page:1,pageSize:5,search:'',status:'',module:'all',sort:'amount',order:'asc'};
describe('Frontend validation and permissions',()=>{
 it('offers the four project choices instead of role choices',()=>{expect(modules.filter(module=>module.key!=='all').map(module=>module.short)).toEqual(['Kisalu','Inter Urbain','Kelasi','Étudiant']);});
 it('labels payment-card beneficiary as Nom',()=>{expect(resources.payments.fields.find(field=>field.key==='name')?.label).toBe('Nom');});
 it('rejects invalid email, weak passwords and malformed OTP',()=>{expect(loginSchema.safeParse({email:'incorrect',password:'123'}).success).toBe(false);expect(otpSchema.safeParse({code:'123456'}).success).toBe(true);expect(otpSchema.safeParse({code:'12345a'}).success).toBe(false);});
 it('restricts administration and finance by role',()=>{expect(can('Administrateur','admin')).toBe(true);expect(can('Finance','admin')).toBe(false);expect(can('Finance','finance')).toBe(true);expect(can('Observateur','write')).toBe(false);expect(can(undefined)).toBe(false);});
 it('validates IP addresses and CIDR masks',()=>{const valid={name:'Bureau',address:'192.168.1.0/24',entity:'TAC-Étudiant'};expect(resourceSchema(resources['ip-rules']).safeParse(valid).success).toBe(true);for(const address of ['999.1.1.1','192.168.1.1/33','192.168.1.1/foo'])expect(resourceSchema(resources['ip-rules']).safeParse({...valid,address}).success).toBe(false);});
 it('rejects negative or empty payment amounts',()=>{const valid={name:'Test étudiant',email:'test@exemple.demo',entity:'TAC-Étudiant',amount:10000,channel:'Mobile Money'};expect(resourceSchema(resources.payments).safeParse(valid).success).toBe(true);expect(resourceSchema(resources.payments).safeParse({...valid,amount:-10}).success).toBe(false);expect(resourceSchema(resources.payments).safeParse({...valid,amount:''}).success).toBe(false);});
 it('allows the student phone number to be empty',()=>{const student={name:'Étudiant Test',email:'test@exemple.demo',registration:'ETU-001',establishment:'Université de Kinshasa',faculty:'Sciences',department:'Informatique',option:'Génie logiciel',province:'Kinshasa',sex:'Féminin',phone:''};expect(resourceSchema(resources.students).safeParse(student).success).toBe(true);});
});
describe('Combined table operations',()=>{
 it('adds student sex and phone, omits status, and filters on sex',()=>{const students=seed().records.students;expect(students.every(row=>['Féminin','Masculin'].includes(String(row.sex))&&String(row.phone).startsWith('+243 '))).toBe(true);expect(resources.students.columns).toContain('sex');expect(resources.students.columns).toContain('phone');expect(resources.students.columns).not.toContain('status');const filtered=filterRecords(students,{...params,status:'',sex:'Féminin'});expect(filtered.data.length).toBeGreaterThan(0);expect(filtered.data.every(row=>row.sex==='Féminin')).toBe(true);});
 it('seeds prélèvements as a Transactions submenu without reference, phone, or card columns',()=>{const rows=seed().records.prelevements;expect(resources.prelevements.parent).toBe('transactions');expect(rows).toHaveLength(2);expect(rows.map(row=>row.generatedId)).toEqual(['STDTAC20240111076','STDTAC202401110970']);expect(resources.prelevements.columns).not.toContain('reference');expect(resources.prelevements.columns).not.toContain('phone');expect(resources.prelevements.columns).not.toContain('cardNumber');});
 it('searches cards by STDTAC number with or without separators',()=>{const cards=seed().records.cards;const number=String(cards[0].cardNumber);expect(number.startsWith('STDTAC')).toBe(true);expect(filterRecords(cards,{...params,search:number.replace(/[^a-z0-9]/gi,'')}).total).toBe(1);});
 const rows=seed().records.transactions;
 it('combines search, module and status before pagination',()=>{const result=filterRecords(rows,{...params,search:'Grace',module:'interurbain',status:'Réussie'});expect(result.data.every(r=>r.module==='interurbain'&&r.status==='Réussie'&&r.name.includes('Grâce'))).toBe(true);});
 it('sorts numeric values before paginating',()=>{const first=filterRecords(rows,params);const next=filterRecords(rows,{...params,page:2});expect(first.data).toHaveLength(5);expect(Number(first.data[4].amount)).toBeLessThan(Number(next.data[0].amount));expect(first.total).toBe(rows.length);});
 it('supports date ranges and empty results',()=>{const filtered=filterRecords(rows,{...params,from:'2026-11-01',to:'2026-11-03'});expect(filtered.data.every(r=>r.createdAt.slice(0,10)>='2026-11-01')).toBe(true);expect(filterRecords(rows,{...params,search:'no-such-student-xyz'}).total).toBe(0);});
});
