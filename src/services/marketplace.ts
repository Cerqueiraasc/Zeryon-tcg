import type { Listing, MarketplaceState } from '../types/marketplace';
import { cards } from '../data/catalog';
import { players } from '../data/marketplace';
const validDate=(value:unknown)=>typeof value==='string'&&Number.isFinite(Date.parse(value));
export function parseMarketplace(raw:unknown):MarketplaceState {
 if(!raw||typeof raw!=='object')throw new Error('Marketplace inválido');
 const m=raw as MarketplaceState;
 if(!Array.isArray(m.listings)||!Array.isArray(m.friends)||!Array.isArray(m.orders))throw new Error('Marketplace inválido');
 if(!m.listings.every(l=>l&&typeof l.id==='string'&&cards.some(c=>c.id===l.cardId)&&(l.sellerId==='me'||players.some(p=>p.id===l.sellerId))&&Number.isFinite(l.price)&&l.price>0&&l.price<=1000000&&['active','sold','withdrawn'].includes(l.status)&&typeof l.condition==='string'&&typeof l.language==='string'&&typeof l.edition==='string'&&typeof l.description==='string'&&validDate(l.createdAt))||new Set(m.listings.map(l=>l.id)).size!==m.listings.length)throw new Error('Anúncios inválidos');
 if(!m.friends.every(id=>players.some(p=>p.id===id))||new Set(m.friends).size!==m.friends.length)throw new Error('Amigos inválidos');
 if(!m.orders.every(o=>o&&typeof o.id==='string'&&validDate(o.createdAt)&&m.listings.some(l=>l.id===o.listingId&&l.sellerId!=='me'&&l.status==='sold'&&l.price===o.price))||new Set(m.orders.map(o=>o.listingId)).size!==m.orders.length)throw new Error('Compras inválidas');
 return m;
}
export function buyListing(state:MarketplaceState,id:string,now:string):MarketplaceState {
 const listing=state.listings.find(l=>l.id===id);
 if(!listing||listing.status!=='active'||listing.sellerId==='me')throw new Error('Anúncio indisponível');
 return {...state,listings:state.listings.map(l=>l.id===id?{...l,status:'sold'}:l),orders:[{id:crypto.randomUUID(),listingId:id,price:listing.price,createdAt:now},...state.orders]};
}
export function publishListing(state:MarketplaceState,listing:Listing):MarketplaceState {
 if(listing.sellerId!=='me'||listing.status!=='active')throw new Error('Anúncio inválido');
 return parseMarketplace({...state,listings:[listing,...state.listings]});
}
export function toggleFriend(state:MarketplaceState,id:string):MarketplaceState {
 if(!players.some(p=>p.id===id))throw new Error('Jogador inválido');
 return {...state,friends:state.friends.includes(id)?state.friends.filter(f=>f!==id):[...state.friends,id]};
}
