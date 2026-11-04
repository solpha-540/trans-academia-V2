import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ShieldX } from 'lucide-react';
import { useSession } from '../stores/session';
import { can } from '../lib/permissions';
import type { Permission } from '../types';
import { Button } from './ui/button';
export function ProtectedRoute(){const session=useSession(s=>s.session);const location=useLocation();if(!session||session.expiresAt<=Date.now())return <Navigate to="/login" state={{from:location.pathname+location.search}} replace/>;return <Outlet/>;}
export function PermissionGuard({permission='read',children}:{permission?:Permission;children:ReactNode}) {const role=useSession(s=>s.session?.user.role);return can(role,permission)?<>{children}</>:<div className="state access-denied"><ShieldX size={40}/><span className="eyebrow">ERREUR 403</span><h1>Accès réservé</h1><p>Votre profil ne permet pas de consulter cette interface.</p><Button asChild><Link to="/">Revenir au tableau de bord</Link></Button></div>;}
