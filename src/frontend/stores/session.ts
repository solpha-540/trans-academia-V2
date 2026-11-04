import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '../types';
interface SessionState { session: Session | null; challenge: string | null; email: string; setSession: (session:Session)=>void; setChallenge:(id:string,email:string)=>void; logout:()=>void; }
export const useSession = create<SessionState>()(persist(set => ({session:null,challenge:null,email:'',setSession:session=>set({session,challenge:null}),setChallenge:(challenge,email)=>set({challenge,email}),logout:()=>set({session:null,challenge:null,email:''})}),{name:'tac-demo-session',partialize: s=>({session:s.session,challenge:s.challenge,email:s.email})}));
