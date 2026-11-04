import type { ReactNode } from 'react';
import SpkBadge from '../uielements/spk-badge';
interface SpkHrmcardsProps {
  Customclass?:string;
  Titletext?:string;
  Value?:string|number;
  Increment?:string;
  Color?:string;
  Icon?:string;
  icon?:ReactNode;
  caption?:ReactNode;
}
export default function SpkHrmcards({Customclass='',Titletext,Value,Increment,Color='primary',Icon,icon,caption='Ce mois'}:SpkHrmcardsProps){return <div className={'box hrm-main-card '+Color}>
 <div className="box-body"><div className="template-metric-top"><span className={'avatar '+Customclass}>{icon||<i className={'ri-'+Icon+' text-[1.125rem]'} aria-hidden="true"/>}</span><span className="template-metric-label">{Titletext}</span></div>
 <h3 className="template-metric-value">{Value}</h3><div className="template-metric-footer"><span className="template-metric-caption">{caption}</span>{Increment&&<SpkBadge variant={Color+'/10'} customClass={'text-'+Color}>{Increment}</SpkBadge>}</div></div>
 </div>;}
