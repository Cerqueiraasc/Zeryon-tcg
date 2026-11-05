import { describe, expect, it } from 'vitest';
import { addEntry, cardThumbnail, clampQuantity, emptyState, formatMoney, lastDetails, parseCollection, searchCards, storageKey } from './collection';
import { cards } from '../data/catalog';
import { defaultDetails } from '../data/options';
describe('collection backup validation',()=>{
 it('keeps the storage key',()=>{expect(storageKey).toBe('minha-colecao:v1')});
 it('round trips a collection without losing copy metadata',()=>{
  const collection={...emptyState,entries:[{cardId:'sv3pt5-199',quantity:2,condition:'Jogada',language:'Japonês',edition:'Normal',addedAt:'2026-11-05T12:00:00.000Z'}],favorites:['sv3pt5-199']};
  expect(parseCollection(JSON.parse(JSON.stringify(collection)))).toEqual(collection);
 });
 it.each([null,{}, {entries:[null],favorites:[]},{entries:[{cardId:'x',quantity:-1}],favorites:[]},{entries:[],favorites:[7]}])('rejects malformed backups before replacing data: %j',(value)=>{expect(()=>parseCollection(value)).toThrow()});
 it('accepts an empty backup',()=>{expect(parseCollection(emptyState)).toEqual(emptyState)});
 it('formats the explicitly fixed demo conversions',()=>{expect(formatMoney(100,'USD')).toContain('20,00');expect(formatMoney(100,'JPY')).toContain('3.000')});
});

describe('addEntry',()=>{
 const perto={condition:'Perto de nova',language:'Português',edition:'Normal'};
 const jogada={condition:'Jogada',language:'Português',edition:'Normal'};
 it('appends a new entry',()=>{
  const next=addEntry(emptyState,'a',2,perto,'2026-11-05T10:00:00.000Z');
  expect(next.entries).toEqual([{cardId:'a',quantity:2,...perto,addedAt:'2026-11-05T10:00:00.000Z'}]);
 });
 it('merges same details and moves to the end',()=>{
  let s=addEntry(emptyState,'a',1,perto,'2026-11-05T10:00:00.000Z');
  s=addEntry(s,'b',1,jogada,'2026-11-05T11:00:00.000Z');
  s=addEntry(s,'a',2,perto,'2026-11-05T12:00:00.000Z');
  expect(s.entries.length).toBe(2);
  expect(s.entries[1]).toEqual({cardId:'a',quantity:3,...perto,addedAt:'2026-11-05T10:00:00.000Z'});
  expect(lastDetails(s)).toEqual(perto);
 });
 it('keeps different details apart',()=>{
  let s=addEntry(emptyState,'a',1,perto,'2026-11-05T10:00:00.000Z');
  s=addEntry(s,'a',1,{...perto,language:'Inglês'},'2026-11-05T11:00:00.000Z');
  expect(s.entries.length).toBe(2);
 });
});
describe('lastDetails',()=>{
 const entry={cardId:'a',quantity:1,addedAt:'2026-11-05T10:00:00.000Z',language:'Inglês',edition:'Holográfica'};
 it('uses the last entry',()=>{expect(lastDetails({...emptyState,entries:[{...entry,condition:'Jogada'}]})).toEqual({condition:'Jogada',language:'Inglês',edition:'Holográfica'})});
 it('defaults when empty',()=>{expect(lastDetails(emptyState)).toEqual(defaultDetails)});
 it('ignores unknown options from restored backups',()=>{expect(lastDetails({...emptyState,entries:[{...entry,condition:'Excelente'}]})).toEqual(defaultDetails)});
});
describe('cardThumbnail',()=>{
 it('uses the lighter image in lists',()=>{expect(cardThumbnail('https://images.pokemontcg.io/swsh12pt5gg/GG70_hires.png')).toBe('https://images.pokemontcg.io/swsh12pt5gg/GG70.png')});
});
describe('clampQuantity',()=>{
 it.each([[NaN,1],[0,1],[-3,1],[2.5,2],[1,1],[999,999],[1000,999]])('%s becomes %s',(input,expected)=>{expect(clampQuantity(input)).toBe(expected)});
});
describe('searchCards',()=>{
 const names=(q:string)=>searchCards(cards,q).map(c=>c.name);
 it('ignores case and surrounding spaces',()=>{expect(names(' PIKACHU ')).toEqual(['Pikachu'])});
 it('ignores accents and matches the set',()=>{expect(names('ceus')).toEqual(expect.arrayContaining(['Rayquaza VMAX','Umbreon VMAX']));expect(names('evolucao').sort()).toEqual(['Rayquaza VMAX','Umbreon VMAX'])});
 it('matches the number',()=>{expect(names('199/165')).toEqual(['Charizard ex'])});
 it('matches the rarity',()=>{expect(names('ultra rara')).toContain('Arceus VSTAR')});
 it('returns everything for a blank query',()=>{expect(searchCards(cards,'   ').length).toBe(cards.length)});
 it('returns nothing when there is no match',()=>{expect(names('xyz')).toEqual([])});
});
