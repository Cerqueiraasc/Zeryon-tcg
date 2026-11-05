import { useState } from 'react';
import { findAvatar } from '../../data/avatars';

export function Avatar({avatarId,large=false}: {avatarId?:string;large?:boolean}) {
 const avatar = findAvatar(avatarId);
 const [failedImage,setFailedImage] = useState<string>();
 return <span className={`avatar character-avatar${large?' large':''}`}>
  {avatar && failedImage !== avatar.id
   ? <img src={`/avatars/${avatar.id}.png`} alt={`Avatar ${avatar.name}`} onError={()=>setFailedImage(avatar.id)}/>
   : <span aria-label="Avatar padrão">T</span>}
 </span>;
}
