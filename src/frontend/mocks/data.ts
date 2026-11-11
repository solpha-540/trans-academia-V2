import { resourceList } from '../config/resources';
import type { RecordItem,Session } from '../types';
export const DEMO_PASSWORD='Demo@2026';
export const DEMO_OTP='123456';
export const accounts = [
 {id:'usr-admin',name:'Aline Mukendi',email:'admin@trans-academia.demo',role:'Administrateur' as const},
 {id:'usr-finance',name:'Patrick Ilunga',email:'finance@trans-academia.demo',role:'Finance' as const},
 {id:'usr-agent',name:'Sarah Kabeya',email:'agent@trans-academia.demo',role:'Opérateur' as const},
 {id:'usr-support',name:'David Mbuyi',email:'support@trans-academia.demo',role:'Support' as const},
 {id:'usr-reader',name:'Grace Kabila',email:'lecture@trans-academia.demo',role:'Observateur' as const},
];
const people=['Grâce Kabeya','Christian Ilunga','Marie Mukendi','Patrick Tshibanda','Sarah Mbuyi','Emmanuel Kalala','Rachel Mutombo','David Kasongo','Esther Mavungu','Jonathan Banza','Aline Kabila','Samuel Mulumba'];
const institutions=['Université de Kinshasa','Université de Lubumbashi','ISTA Kinshasa','Université Kongo'];
export interface DemoDB {records:Record<string,RecordItem[]>;sessions:Record<string,Session>;challenges:Record<string,{email:string;expires:number;attempts:number;lastSent:number}>;settings:Record<string,Record<string,unknown>>;}
export function seed():DemoDB {
 const records:Record<string,RecordItem[]>={};
 for(const config of resourceList) {
  const amount=config.key==='prelevements'?2:config.group==='Administration'?5:38;
  records[config.key]=Array.from({length:amount},(_,i)=>{
   const module=['interurbain','kelasi','etudiant'][i%3];
   const record:RecordItem={id:config.key.slice(0,3).toUpperCase()+'-'+String(2026001+i),name:people[i%people.length],status:config.statuses[i%7===0?Math.min(2,config.statuses.length-1):i%4===0?1:0],module,createdAt:new Date(Date.UTC(2026,10,3-i%30,8+i%10,12)).toISOString()};
   for(const field of config.fields) {
    if(field.key==='name') continue;
    record[field.key]=field.type==='select'?field.options![i%field.options!.length]:field.type==='number'?(i+1)*2500:field.type==='email'?'contact'+(i+1)+'@exemple.demo':field.type==='date'?'2027-02-'+String(1+i%28).padStart(2,'0'):field.type==='textarea'?'Demande de vérification de la carte et du statut du paiement. Donnée fictive.':field.label+' '+(i+1);
   }
   Object.assign(record,{entity:['TAC-Inter Urbain','TAC-Kelasi','TAC-Étudiant'][i%3]});
   if(config.fields.some(f=>f.key==='establishment')) record.establishment=institutions[i%4];
   if(config.fields.some(f=>f.key==='cardNumber')) record.cardNumber=config.key==='cards'?'STDTAC'+String(20240110000+i):'TAC-'+String(100245+i);
   if(config.fields.some(f=>f.key==='registration')) record.registration='ETU-'+String(26001+i);
   if(config.key==='students') {record.sex=i%2===0?'Féminin':'Masculin';record.phone='+243 '+['810','820','830','840'][i%4]+' '+String(100000+i).padStart(6,'0');}
   if(config.key==='subscriptions') {record.currency='CDF';record.amount=(i+1)*2500;}
   if(config.key==='prelevements') {
    const examples=[
     {date:'2026-11-11 05:25:57',generatedId:'STDTAC20240111076',reference:'APBXLO380581',cardNumber:'MPTAC085jejsva250489',name:'NKIDIAKA LUKIELO Papson',operator:'MPESA',phone:'24381919014',amount:21.5,status:'À valider'},
     {date:'2026-11-11 09:08:09',generatedId:'STDTAC202401110970',reference:'LZLGG3801000',cardNumber:'MPTAC021wcrwzl080101',name:'Mulemba Onda Best',operator:'MPESA',phone:'24383393820',amount:41.5,status:'Validé'},
    ];
    Object.assign(record,examples[i%examples.length],{module:'etudiant'});
   }
   if(config.key==='entities') record.name=['TAC-Inter Urbain','TAC-Kelasi','TAC-Étudiant','Direction Kinshasa','Direction Katanga'][i];
   if(config.key==='provinces') record.name=['Kinshasa','Kongo-Central','Haut-Katanga','Nord-Kivu','Sud-Kivu'][i];
   if(config.key==='establishments') record.name=institutions[i%4];
   if(config.key==='faculties') record.name=['Sciences','Droit','économie','Médecine','Polytechnique'][i];
   if(config.key==='departments') record.name=['Informatique','Gestion','Droit public','Sciences biomédicales','électronique'][i];
   if(config.key==='options') record.name=['Génie logiciel','Finance','Administration','Réseaux','Droit des affaires'][i];
   if(config.key==='roles') record.name=accounts[i].role;
   if(config.key==='ip-rules') {record.name='Accès bureau '+(i+1);record.address='192.168.'+i+'.0/24';}
   if(config.key==='pricing') {record.name=['Carte standard','Mensuel étudiant','Trimestriel','Annuel','Carte scolaire'][i];record.amount=[10000,25000,65000,240000,5000][i];}
   if(config.key==='currencies') {record.name=i%2?'Dollar américain':'Franc congolais';record.code=i%2?'USD':'CDF';record.rate=i%2?2800:1;}
   if(config.key==='reconciliation') {record.name='LOT-2026-'+String(100+i);record.expected=150000+i*2500;record.received=Number(record.expected)-(i%4===0?5000:0);record.difference=Number(record.received)-Number(record.expected);record.status=record.difference?'Écart détecté':i%3?'Rapproché':'À rapprocher';}
   if(config.key==='monitoring') record.name=['Paiement confirmé','Lecture de carte','Délai de réponse élevé','Synchronisation','Validation inscription'][i%5];
   if(config.key==='tickets') record.name=['Carte non reconnue','Paiement en attente','Correction de matricule','Renouvellement abonnement','Accès au compte'][i%5];
   return record;
  });
 }
 return {records,sessions:{},challenges:{},settings:{}};
}
const storageKey='tac-demo-data-v1';
export function loadDB():DemoDB {
 try{
  const storage=globalThis.localStorage;
  const raw=storage?.getItem(storageKey);
  if(raw){
   const loaded=JSON.parse(raw) as DemoDB;
   const defaults=seed();
   let normalized=false;
   loaded.records??={};
   for(const config of resourceList){
    if(!Array.isArray(loaded.records[config.key])){
     loaded.records[config.key]=defaults.records[config.key];
     normalized=true;
    }
   }
   for(const [index,row] of loaded.records.students.entries()){
    const fallback=defaults.records.students[index%defaults.records.students.length];
    for(const key of ['sex','phone'] as const){
     if(!row[key]){row[key]=fallback[key];normalized=true;}
    }
   }
   for(const row of loaded.records.subscriptions){
    if(row.currency!=='CDF'){row.currency='CDF';normalized=true;}
   }
   loaded.sessions??={};
   loaded.challenges??={};
   loaded.settings??={};
   if(storage&&normalized){try{storage.setItem(storageKey,JSON.stringify(loaded));}catch{/* Keep the migrated data usable in memory. */}}
   return loaded;
  }
 }catch{/* Storage unavailable or invalid: use fresh demo data. */}
 return seed();
}
export let db=loadDB();
export function saveDB(){try{globalThis.localStorage?.setItem(storageKey,JSON.stringify(db));}catch{/* Demo remains usable in memory. */}}
export function resetDB(){const sessions=db.sessions;db=seed();db.sessions=sessions;saveDB();}
