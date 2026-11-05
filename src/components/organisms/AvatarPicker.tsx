import { useState } from 'react';
import { Check } from 'lucide-react';
import { avatars, avatarCategories, findAvatar } from '../../data/avatars';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';

export function AvatarPicker({avatarId,onSave,onCancel}: {avatarId?:string;onSave:(id:string|undefined)=>void;onCancel:()=>void}) {
 const [selected,setSelected] = useState(avatarId);
 return <div className="avatar-picker">
  <p>Escolha quem vai acompanhar sua jornada. Você pode trocar quando quiser.</p>
  <div className="avatar-preview"><Avatar avatarId={selected} large/><div><strong>{findAvatar(selected)?.name ?? 'Treinador'}</strong><p>Prévia do seu avatar</p></div></div>
  <button type="button" className="avatar-default" aria-pressed={!selected} onClick={()=>setSelected(undefined)}>Usar avatar padrão {!selected && <Check size={16}/>}</button>
  {avatarCategories.map(category=><section key={category} className="avatar-category"><h3>{category}</h3><div className="avatar-options">
   {avatars.filter(a=>a.category===category).map(avatar=><button type="button" key={avatar.id} className={`avatar-option${selected===avatar.id?' chosen':''}`} aria-pressed={selected===avatar.id} onClick={()=>setSelected(avatar.id)}>
    <Avatar avatarId={avatar.id}/><span>{avatar.name}</span>{selected===avatar.id && <Check className="avatar-check" size={16}/>}
   </button>)}
  </div></section>)}
  <div className="avatar-picker-actions"><Button variant="secondary" onClick={onCancel}>Cancelar</Button><Button onClick={()=>onSave(selected)}>Salvar avatar</Button></div>
 </div>;
}
