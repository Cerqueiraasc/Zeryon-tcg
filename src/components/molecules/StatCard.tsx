import type { ReactNode } from 'react';
export function StatCard({icon,label,value,detail}: {icon:ReactNode;label:string;value:string|number;detail:string}) {return <div className="stat"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><strong>{value}</strong><small>{detail}</small></div>}
