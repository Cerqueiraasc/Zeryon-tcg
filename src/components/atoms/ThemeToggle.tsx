import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../../types';

export function ThemeToggle({theme,onToggle}: {theme:Theme;onToggle:()=>void}) {
 const label=theme==='dark'?'Ativar tema claro':'Ativar tema escuro';
 return <button type="button" className="icon-button" aria-label={label} title={label} onClick={onToggle}>
  {theme==='dark'?<Sun size={20}/>:<Moon size={20}/>}
 </button>;
}
