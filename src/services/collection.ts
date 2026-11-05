import type { Card, CardDetails, CollectionState } from '../types';
import { conditions, defaultDetails, editions, languages } from '../data/options';
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
export function addEntry(state: CollectionState, cardId: string, quantity: number, details: CardDetails, addedAt: string): CollectionState {
 const same = state.entries.find(e => e.cardId === cardId && e.condition === details.condition && e.language === details.language && e.edition === details.edition);
 if (!same) return {...state, entries: [...state.entries, {cardId, quantity, ...details, addedAt}]};
 // A entrada somada vai para o fim: o preenchimento lê o último item, e o histórico ordena por addedAt.
 return {...state, entries: [...state.entries.filter(e => e !== same), {...same, quantity: same.quantity + quantity}]};
}
export function lastDetails(state: CollectionState): CardDetails {
 const last = state.entries[state.entries.length - 1];
 if (!last || !conditions.includes(last.condition) || !languages.includes(last.language) || !editions.includes(last.edition)) return defaultDetails;
 return {condition: last.condition, language: last.language, edition: last.edition};
}
export function clampQuantity(value: number): number {
 if (!Number.isFinite(value)) return 1;
 return Math.min(999, Math.max(1, Math.trunc(value)));
}
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function searchCards(list: Card[], query: string): Card[] {
 const q = normalize(query);
 return list.filter(c => normalize(`${c.name} ${c.number} ${c.rarity} ${c.set}`).includes(q));
}
