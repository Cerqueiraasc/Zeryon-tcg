import type { CollectionState } from '../types';
export const storageKey = 'minha-colecao:v1';
export const emptyState: CollectionState = {entries: [], favorites: [], settings: {currency:'BRL',language:'pt-BR'}};
export function parseCollection(raw: unknown): CollectionState {
 if (!raw || typeof raw !== 'object') throw new Error('Backup inválido');
 const v = raw as CollectionState;
 if (!Array.isArray(v.entries) || !v.entries.every(e => e && typeof e.cardId === 'string' && Number.isInteger(e.quantity) && e.quantity > 0 && e.quantity <= 999999 && typeof e.addedAt === 'string' && Number.isFinite(Date.parse(e.addedAt)) && typeof e.condition === 'string' && typeof e.language === 'string' && typeof e.edition === 'string') || !Array.isArray(v.favorites) || !v.favorites.every(f => typeof f === 'string')) throw new Error('Backup inválido');
 return {...v,settings:{currency:['BRL','USD','JPY'].includes(v.settings?.currency) ? v.settings.currency : 'BRL',language:v.settings?.language === 'en-US' ? 'en-US' : 'pt-BR'}};
}
export function readCollection(): CollectionState {
 try { return parseCollection(JSON.parse(localStorage.getItem(storageKey) || 'null')); } catch { return emptyState; }
}
export function formatMoney(value: number, currency: CollectionState['settings']['currency']) {
 // Fixed fictional conversion for presentation, never a live exchange rate.
 return new Intl.NumberFormat('pt-BR',{style:'currency',currency,maximumFractionDigits:currency==='JPY'?0:2}).format(value * ({BRL:1,USD:0.2,JPY:30}[currency]));
}
