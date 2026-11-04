import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle,Save } from 'lucide-react';
import { resourceSchema } from '../lib/validation';
import type { ResourceConfig,RecordItem } from '../types';
import { Input } from './ui/input';
import { Button } from './ui/button';
export function ResourceForm({config,initial,onSave,onCancel,pending}:{config:ResourceConfig;initial?:RecordItem|null;onSave:(data:Record<string,unknown>)=>void;onCancel:()=>void;pending:boolean}){
 const defaults=Object.fromEntries(config.fields.map(f=>[f.key,initial?.[f.key]??(f.type==='select'?f.options![0]:f.type==='number'?'':'')]));
 const form=useForm({resolver:zodResolver(resourceSchema(config)),defaultValues:defaults});
 return <form onSubmit={form.handleSubmit(onSave)}><div className="form-grid">{config.fields.map(f=><div className={'form-field '+(f.type==='textarea'?'full-width':'')} key={f.key}><label className="ti-form-label" htmlFor={'field-'+f.key}>{f.label}{f.required&&<span aria-hidden="true"> *</span>}</label>{f.type==='select'?<select id={'field-'+f.key} className="input ti-form-control form-control" aria-required={f.required} {...form.register(f.key)}>{f.options!.map(v=><option key={v}>{v}</option>)}</select>:f.type==='textarea'?<textarea id={'field-'+f.key} className="input" rows={4} {...form.register(f.key)}/>:<Input id={'field-'+f.key} aria-required={f.required} type={f.type||'text'} step={f.key==='rate'?'0.01':undefined} {...form.register(f.key)}/ >}{form.formState.errors[f.key]&&<span className="field-error" role="alert">{String(form.formState.errors[f.key]?.message)}</span>}</div>)}</div><p className="form-note">Données de démonstration enregistrées uniquement dans ce navigateur.</p><div className="dialog-footer"><Button type="button" variant="outline" onClick={onCancel}>Annuler</Button><Button disabled={pending}>{pending?<LoaderCircle size={16} className="animate-spin"/>:<Save size={16}/>} Enregistrer</Button></div></form>;
}
