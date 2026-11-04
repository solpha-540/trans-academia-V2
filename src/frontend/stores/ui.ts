import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Module } from '../types';
interface UI { collapsed:boolean; mobileOpen:boolean; dark:boolean; module:Module; toggleSidebar:()=>void; setMobileOpen:(v:boolean)=>void; toggleDark:()=>void; setModule:(v:Module)=>void; }
export const useUI = create<UI>()(persist(set=>({collapsed:false,mobileOpen:false,dark:false,module:'all',toggleSidebar:()=>set(s=>({collapsed:!s.collapsed})),setMobileOpen:mobileOpen=>set({mobileOpen}),toggleDark:()=>set(s=>({dark:!s.dark})),setModule:module=>set({module})}),{name:'tac-demo-ui',partialize:s=>({collapsed:s.collapsed,dark:s.dark,module:s.module})}));
