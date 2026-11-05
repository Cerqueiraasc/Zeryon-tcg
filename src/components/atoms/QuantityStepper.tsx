import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { clampQuantity } from '../../services/collection';
export function QuantityStepper({value,onChange}: {value:number;onChange:(n:number)=>void}) {
 // Rascunho do que está sendo digitado: permite apagar o campo sem gravar um valor inválido.
 const [draft,setDraft]=useState<string|null>(null);
 const step=(delta:number)=>{setDraft(null);onChange(clampQuantity(value+delta))};
 return <span className="stepper">
  <button type="button" aria-label="Diminuir quantidade" disabled={value<=1} onClick={()=>step(-1)}><Minus size={18}/></button>
  <input type="number" inputMode="numeric" min="1" max="999" aria-label="Quantidade" value={draft??value} onChange={e=>{setDraft(e.target.value);onChange(clampQuantity(Number(e.target.value||NaN)))}} onBlur={()=>setDraft(null)}/>
  <button type="button" aria-label="Aumentar quantidade" disabled={value>=999} onClick={()=>step(1)}><Plus size={18}/></button>
 </span>;
}
