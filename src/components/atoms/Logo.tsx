import { useId } from 'react';
const navy = '#002776';
const flagGreen = '#009c3b';
const yellow = '#ffd21f';
export const brandName = 'Zeryon TCG';
export const brandTagline = 'Seu universo TCG em um só lugar';
function FullSymbol({onDark}: {onDark: boolean}) {
 const clip = useId();
 return <>
  <defs><clipPath id={clip}><circle cx="50" cy="50" r="15.5"/></clipPath></defs>
  <rect x="22" y="8" width="62" height="84" rx="9" fill={navy} stroke={onDark ? '#fff' : undefined} strokeWidth={onDark ? 2 : undefined} transform="rotate(9 50 50)"/>
  <g transform="rotate(-7 50 50)">
   <rect x="19" y="7" width="62" height="86" rx="9" fill={flagGreen} stroke="#fff" strokeWidth="2"/>
   <polygon points="50,15 75,50 50,85 25,50" fill={yellow}/>
   <circle cx="50" cy="50" r="15.5" fill={navy}/>
   <path d="M30 53 Q50 44 70 52" fill="none" stroke="#fff" strokeWidth="4.5" clipPath={`url(#${clip})`}/>
   <circle cx="50" cy="49" r="4.6" fill="#fff" stroke={navy} strokeWidth="2.2"/>
  </g>
 </>;
}
function SmallSymbol() {
 return <g transform="rotate(-7 50 50)">
  <rect x="15" y="3" width="70" height="94" rx="11" fill={flagGreen} stroke="#fff" strokeWidth="2"/>
  <polygon points="50,11 80,50 50,89 20,50" fill={yellow}/>
  <circle cx="50" cy="50" r="21" fill={navy}/>
  <circle cx="50" cy="50" r="8" fill="#fff"/>
 </g>;
}
export function Logo({size = 44, variant = 'full', showText = true, showTagline = false, onDark = false}: {size?: number; variant?: 'full' | 'small'; showText?: boolean; showTagline?: boolean; onDark?: boolean}) {
 return <span className={`logo ${onDark ? 'on-dark' : ''}`}>
  <svg className="logo-symbol" viewBox="0 0 100 100" width={size} height={size} aria-hidden={showText || undefined} role={showText ? undefined : 'img'} aria-label={showText ? undefined : brandName}>
   {variant === 'small' ? <SmallSymbol/> : <FullSymbol onDark={onDark}/>}
  </svg>
  {showText && <span className="logo-text">
   <span className="logo-name">Zeryon <b>TCG</b></span>
   {showTagline && <small className="logo-tagline">{brandTagline}</small>}
  </span>}
 </span>;
}
