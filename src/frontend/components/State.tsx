import loaderImage from '../../assets/images/media/loader.svg';
import { AlertCircle, Inbox } from 'lucide-react';
import { Button } from './ui/button';
export function Loading(){return <div className="state" role="status"><img className="template-loading-image" src={loaderImage} alt="" width="52" height="52"/><p>Chargement des données…</p></div>;}
export function Empty({message='Aucun résultat pour ces filtres.'}:{message?:string}){return <div className="state"><Inbox size={32}/><h3>Aucune donnée à afficher</h3><p>{message}</p></div>;}
export function ErrorState({message,retry}:{message:string;retry:()=>void}){return <div className="state" role="alert"><AlertCircle/><h3>Impossible de charger les données</h3><p>{message}</p><Button variant="outline" onClick={retry}>Réessayer</Button></div>;}
