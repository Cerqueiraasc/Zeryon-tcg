import { BookOpen, LayoutDashboard, Layers3, Trophy, UserRound, Settings, ScanLine, Store } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Page, Theme } from '../../types';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { Avatar } from '../atoms/Avatar';
import { ThemeToggle } from '../atoms/ThemeToggle';
const nav = [
 {id:'home',label:'Visão geral',short:'Início',icon:LayoutDashboard},
 {id:'collection',label:'Minha coleção',short:'Coleção',icon:BookOpen},
 {id:'sets',label:'Explorar coleções',short:'Explorar',icon:Layers3},
 {id:'marketplace',label:'Marketplace',short:'Mercado',icon:Store},
 {id:'events',label:'Campeonatos',short:'Eventos',icon:Trophy},
 {id:'profile',label:'Meu perfil',short:'Perfil',icon:UserRound},
] as const;
export function AppLayout({page,onNavigate,onScan,children,avatarId,theme,onToggleTheme}: {page:Page;onNavigate:(p:Page)=>void;onScan:()=>void;children:ReactNode;avatarId?:string;theme:Theme;onToggleTheme:()=>void}) {
 const goHome = (e: React.MouseEvent) => { e.preventDefault(); onNavigate('home'); };
 return <div className="app-shell">
  <aside className="sidebar">
   <a href="#" className="brand" onClick={goHome}><Logo size={46} showTagline/></a>
   <nav aria-label="Principal">
    {nav.map(n => <button key={n.id} onClick={() => onNavigate(n.id)} className={page === n.id ? 'selected' : ''} aria-current={page === n.id ? 'page' : undefined}>
     <n.icon size={20}/><span className="nav-label">{n.label}</span><span className="nav-short">{n.short}</span>
    </button>)}
   </nav>
   <div className="sidebar-bottom">
    <button onClick={() => onNavigate('settings')} className={page === 'settings' ? 'selected' : ''}><Settings size={20}/> Configurações</button>
    <button type="button" className="user profile-shortcut" onClick={()=>onNavigate('profile')} aria-label="Abrir meu perfil e escolher avatar"><Avatar avatarId={avatarId}/><span><strong>Treinador</strong><small>Colecionador</small></span></button>
   </div>
  </aside>
  <div className="main-shell">
   <header className="topbar">
    <a href="#" className="topbar-brand" onClick={goHome}><Logo size={36} variant="small" showTagline/></a>
    <div className="topbar-actions">
     <span className="demo-pill"><i/> MVP · Demonstração</span>
     <ThemeToggle theme={theme} onToggle={onToggleTheme}/>
     <button className="icon-button" aria-label="Configurações" onClick={() => onNavigate('settings')}><Settings size={20}/></button>
     {page!=='home'&&<Button onClick={onScan} aria-label="Escanear carta"><ScanLine size={20}/><span className="topbar-scan-label">Escanear carta</span></Button>}
    </div>
   </header>
   <main>{children}</main>
   <footer>
    <span>Zeryon TCG · Seu universo TCG em um só lugar</span>
    <span>Zeryon TCG é um projeto educacional independente, sem afiliação à The Pokémon Company. Pokémon e as ilustrações das cartas pertencem aos respectivos titulares.</span>
   </footer>
  </div>
 </div>;
}
