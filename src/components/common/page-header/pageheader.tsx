import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
interface PageheaderProps {
  currentpage?: ReactNode;
  activepage?: ReactNode;
  mainpage?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  headingLevel?: 'h1' | 'h3';
  backTo?: string;
}
export default function Pageheader({currentpage,activepage,mainpage,description,actions,headingLevel='h3',backTo='/'}:PageheaderProps){
  const Heading=headingLevel;
  return <div className="page-header page-heading template-page-header">
    <div className="template-page-intro"><Heading className="template-page-title">{currentpage}</Heading>{description&&<p>{description}</p>}</div>
    <div className="template-page-tools"><ol className="breadcrumb" aria-label="Fil d’Ariane"><li className="breadcrumb-item"><Link to={backTo}>{activepage||'Accueil'}</Link><i className="ti ti-chevron-right template-breadcrumb-chevron" aria-hidden="true"/></li><li className="breadcrumb-item active" aria-current="page">{mainpage||currentpage}</li></ol>{actions}</div>
  </div>;
}
