import type { ListParams,RecordItem } from '../types';
export function filterRecords(records:RecordItem[],params:ListParams) {
 const search=params.search.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
 const cardSearch=search.replace(/[^a-z0-9]/g,'');
 const filtered=records.filter(row=>(params.module==='all'||row.module===params.module)&&(!params.status||row.status===params.status)&&(!params.sex||row.sex===params.sex)&&(!params.currency||String(row.currency||'CDF')===params.currency)&&(!params.from||row.createdAt.slice(0,10)>=params.from)&&(!params.to||row.createdAt.slice(0,10)<=params.to)&&(!search||Object.values(row).join(' ').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().includes(search)||Boolean(row.cardNumber&&String(row.cardNumber).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]/g,'').includes(cardSearch))));
 filtered.sort((a,b)=>{const x=a[params.sort],y=b[params.sort];const result=typeof x==='number'&&typeof y==='number'?x-y:String(x??'').localeCompare(String(y??''),'fr',{numeric:true});return params.order==='desc'?-result:result;});
 return {data:filtered.slice((params.page-1)*params.pageSize,params.page*params.pageSize),total:filtered.length,page:params.page,pageSize:params.pageSize};
}
