import { describe, expect, it } from 'vitest';
import { emptyState, formatMoney, parseCollection } from './collection';
describe('collection backup validation',()=>{
 it('round trips a collection without losing copy metadata',()=>{
  const collection={...emptyState,entries:[{cardId:'sv3pt5-199',quantity:2,condition:'Jogada',language:'Japonês',edition:'Normal',addedAt:'2026-11-05T12:00:00.000Z'}],favorites:['sv3pt5-199']};
  expect(parseCollection(JSON.parse(JSON.stringify(collection)))).toEqual(collection);
 });
 it.each([null,{}, {entries:[null],favorites:[]},{entries:[{cardId:'x',quantity:-1}],favorites:[]},{entries:[],favorites:[7]}])('rejects malformed backups before replacing data: %j',(value)=>{expect(()=>parseCollection(value)).toThrow()});
 it('accepts an empty backup',()=>{expect(parseCollection(emptyState)).toEqual(emptyState)});
 it('formats the explicitly fixed demo conversions',()=>{expect(formatMoney(100,'USD')).toContain('20,00');expect(formatMoney(100,'JPY')).toContain('3.000')});
});
