import type { ReactNode } from 'react';
import Pageheader from '../../components/common/page-header/pageheader';
export function PageHeading({title,category,description,actions}:{title:ReactNode;category?:ReactNode;description?:ReactNode;actions?:ReactNode}){return <Pageheader currentpage={title} activepage={category} mainpage={title} description={description} actions={actions} headingLevel="h1"/>;}
