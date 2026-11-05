import { useState, type ReactNode } from 'react';
import { Plus, ScanLine, Search, X } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { brandName, brandTagline } from '../components/atoms/Logo';
import { StatCard } from '../components/molecules/StatCard';
import { cards } from '../data/catalog';
import { searchCards } from '../services/collection';
import type { Card } from '../types';
export function HomePage({total,favoritesCount,value,renderTiles,onAdd,onScan}: {total:number;favoritesCount:number;value:string;renderTiles:(list:Card[])=>ReactNode;onAdd:()=>void;onScan:()=>void}) {
 const [query,setQuery]=useState('');
 const searching=query.trim()!=='';
 const results=searching?searchCards(cards,query):cards.slice(0,4);
 const title=!searching?'Cartas em destaque':results.length===1?'1 carta encontrada':`${results.length} cartas encontradas`;
 return <>
  <h1 className="visually-hidden">{brandName}: {brandTagline}</h1>
  <section className="home-tools">
   <div className="home-search">
    <Search size={22}/>
    <input aria-label="Buscar cartas" placeholder="Buscar carta por nome ou número" value={query} onChange={e=>setQuery(e.target.value)}/>
    {searching&&<button type="button" className="icon-button" aria-label="Limpar busca" onClick={()=>setQuery('')}><X size={20}/></button>}
   </div>
   <Button onClick={onAdd}><Plus size={20}/> Adicionar carta</Button>
   <Button variant="secondary" onClick={onScan}><ScanLine size={20}/> Escanear</Button>
  </section>
  <section className="home-stats" aria-label="Resumo da coleção">
   <StatCard label={total===1?'carta':'cartas'} value={total}/>
   <StatCard label={favoritesCount===1?'favorita':'favoritas'} value={favoritesCount}/>
   <StatCard label="valor ilustrativo" value={value}/>
  </section>
  <p className="home-note">Valores fictícios para demonstração.</p>
  <section>
   <div className="section-title"><h2>{title}</h2></div>
   {results.length
    ?<div className="cards-grid">{renderTiles(results)}</div>
    :<div className="empty"><Search size={40}/><p>Nenhuma carta encontrada.</p><Button variant="secondary" onClick={()=>setQuery('')}>Limpar busca</Button></div>}
  </section>
 </>;
}
