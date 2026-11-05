import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Modal({title,children,onClose,variant='center'}: {title:string;children:ReactNode;onClose:()=>void;variant?:'center'|'sheet'}) {
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current!;dialog.showModal();return()=>dialog.close()},[]);
 return <dialog ref={ref} className={variant==='sheet'?'sheet':undefined} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
  <header className="modal-header"><h2>{title}</h2><button type="button" className="icon-button" aria-label="Fechar" onClick={onClose}><X/></button></header>
  {children}
 </dialog>;
}
