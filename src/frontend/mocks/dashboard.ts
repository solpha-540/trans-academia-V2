import type { RecordItem } from '../types';
export function buildDashboard(records:Record<string,RecordItem[]>,module:string,period:number){
 const days=[7,30,90].includes(period)?period:30;
 const latest=Math.max(Date.UTC(2026,10,3),...records.transactions.map(row=>Date.parse(row.createdAt)));
 const end=new Date(latest);end.setUTCHours(23,59,59,999);
 const start=end.getTime()-(days*86400000)+1;
 const selected=(key:string)=>records[key].filter(row=>module==='all'||row.module===module);
 const transactions=selected('transactions').filter(row=>Date.parse(row.createdAt)>=start&&Date.parse(row.createdAt)<=end.getTime());
 const succeeded=transactions.filter(row=>row.status==='Réussie');
 const bucketCount=days===7?7:days===30?6:12;
 const width=days*86400000/bucketCount;
 const series=Array.from({length:bucketCount},(_,i)=>{const left=start+i*width,right=start+(i+1)*width;const rows=transactions.filter(row=>Date.parse(row.createdAt)>=left&&Date.parse(row.createdAt)<right);return {name:new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'short',timeZone:'UTC'}).format(new Date(left)),revenue:rows.filter(row=>row.status==='Réussie').reduce((sum,row)=>sum+Number(row.amount),0),transactions:rows.length};});
 return {students:selected('students').length,cards:selected('cards').filter(row=>row.status==='Active').length,revenue:succeeded.reduce((sum,row)=>sum+Number(row.amount),0),transactions:transactions.length,successRate:transactions.length?Math.round(succeeded.length/transactions.length*100):0,series,recent:[...transactions].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,5),distribution:['interurbain','kelasi','etudiant'].map((key,i)=>({name:['Inter Urbain','Kelasi','Étudiant'][i],value:transactions.filter(row=>row.module===key).length})),incidents:selected('tickets').filter(row=>row.status!=='Résolu').length,alerts:selected('monitoring').filter(row=>row.status==='Erreur').length};
}
