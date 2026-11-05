import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '../atoms/Button';
import { QuantityStepper } from '../atoms/QuantityStepper';
import { cards } from '../../data/catalog';
import { conditions, editions, languages } from '../../data/options';
import { cardThumbnail, searchCards } from '../../services/collection';
import type { Card, CardDetails } from '../../types';
const catalogNote = 'O cadastro está limitado às 12 cartas do catálogo demonstrativo.';
export function AddCardSheet({card,initialDetails,onSubmit}: {card:Card|null;initialDetails:CardDetails;onSubmit:(card:Card,quantity:number,details:CardDetails)=>void}) {
 const [chosen,setChosen]=useState<Card|null>(card);
 const [query,setQuery]=useState('');
 const [quantity,setQuantity]=useState(1);
 const [details,setDetails]=useState(initialDetails);
 const field=(name:keyof CardDetails,label:string,options:string[])=><label>{label}<select name={name} value={details[name]} onChange={e=>setDetails({...details,[name]:e.target.value})}>{options.map(o=><option key={o}>{o}</option>)}</select></label>;
 if(!chosen){
  const results=searchCards(cards,query);
  return <div className="add-sheet">
   <div className="search"><Search size={18}/><input autoFocus placeholder="Buscar carta por nome ou número" aria-label="Buscar carta para adicionar" value={query} onChange={e=>setQuery(e.target.value)}/></div>
   {results.length?<div className="result-list">{results.map(c=><button type="button" key={c.id} onClick={()=>setChosen(c)}><img src={cardThumbnail(c.image)} alt="" loading="lazy"/><span><strong>{c.name}</strong><span>{c.set} · {c.number}</span></span></button>)}</div>:<p className="add-empty">Nenhuma carta encontrada.</p>}
   <p className="add-note">{catalogNote}</p>
  </div>;
 }
 return <form className="add-sheet" noValidate onSubmit={e=>{e.preventDefault();onSubmit(chosen,quantity,details)}}>
  <div className="chosen-card">
   <img src={cardThumbnail(chosen.image)} alt=""/>
   <div><strong>{chosen.name}</strong><span>{chosen.set} · {chosen.number}</span></div>
   {!card&&<button type="button" className="text-button" onClick={()=>setChosen(null)}>Trocar carta</button>}
  </div>
  <div className="add-rows">
   <div className="add-quantity field"><span>Quantidade</span><QuantityStepper value={quantity} onChange={setQuantity}/></div>
   {field('condition','Condição',conditions)}
   {field('language','Idioma',languages)}
   <div className="add-quantity">{field('edition','Edição',editions)}</div>
  </div>
  <p className="add-note">{catalogNote}</p>
  <Button type="submit"><Plus size={18}/> Adicionar à coleção</Button>
 </form>;
}
