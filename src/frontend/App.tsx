import { Component,Suspense,lazy,useEffect,type ReactNode } from 'react';
import { Routes,Route,Link,useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Layout } from './components/Layout';
import { ProtectedRoute,PermissionGuard } from './components/Guards';
import { useSession } from './stores/session';
import { resourceList } from './config/resources';
import { Button } from './components/ui/button';
import { Loading } from './components/State';
const Dashboard=lazy(()=>import('./pages/Dashboard').then(m=>({default:m.Dashboard}))); 
const ModulePage=lazy(()=>import('./pages/Dashboard').then(m=>({default:m.ModulePage}))); 
const AuthPage=lazy(()=>import('./pages/Auth').then(m=>({default:m.AuthPage}))); 
const ResourcePage=lazy(()=>import('./pages/ResourcePage').then(m=>({default:m.ResourcePage}))); 
const Administration=lazy(()=>import('./pages/Administration').then(m=>({default:m.Administration}))); 
const OnlineRegistration=lazy(()=>import('./pages/OnlineRegistration').then(m=>({default:m.OnlineRegistration}))); 
const Settings=lazy(()=>import('./pages/Settings').then(m=>({default:m.Settings}))); 
function SessionWatcher(){const navigate=useNavigate();const session=useSession(s=>s.session);const logout=useSession(s=>s.logout);useEffect(()=>{const expired=()=>{logout();toast.error('Session expirée. Reconnectez-vous.');navigate('/login',{replace:true});};window.addEventListener('tac:session-expired',expired);const timer=session?setTimeout(expired,Math.max(0,session.expiresAt-Date.now())):undefined;return()=>{window.removeEventListener('tac:session-expired',expired);clearTimeout(timer);};},[session,logout,navigate]);return null;}
class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<div className="state"><h1>Une erreur d’affichage est survenue.</h1><Button onClick={()=>window.location.reload()}>Recharger l’application</Button></div>:this.props.children;}}
export function App(){return <ErrorBoundary><a href="#main-content" className="skip-link">Aller au contenu</a><SessionWatcher/><Suspense fallback={<Loading/>}><Routes><Route path="/login" element={<AuthPage/>}/><Route path="/otp" element={<AuthPage otp/>}/><Route element={<ProtectedRoute/>}><Route element={<Layout/>}><Route index element={<Dashboard/>}/><Route path="statistics" element={<Dashboard statistics/>}/><Route path="modules/:module" element={<ModulePage/>}/><Route path="administration" element={<PermissionGuard permission="admin"><Administration/></PermissionGuard>}/>{resourceList.map(r=><Route key={r.key} path={r.key} element={<ResourcePage resource={r.key}/>}/>)}<Route path="online-registration" element={<PermissionGuard permission="write"><OnlineRegistration/></PermissionGuard>}/><Route path="settings" element={<Settings/>}/><Route path="*" element={<div className="state"><span className="eyebrow">ERREUR 404</span><h1>Cette page n’existe pas.</h1><Button asChild><Link to="/">Revenir au tableau de bord</Link></Button></div>}/></Route></Route></Routes></Suspense></ErrorBoundary>;}
