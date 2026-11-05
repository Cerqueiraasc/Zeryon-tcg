import { describe, expect, it } from 'vitest';
import { cards } from './catalog';
const card = (id: string) => cards.find(c => c.id === id)!;
describe('demo catalog', () => {
 it('keeps every saved card id', () => {
  expect(cards.map(c => c.id).sort()).toEqual(['sv3pt5-199','sv3pt5-173','sv3pt5-198','sv3pt5-197','swsh7-215','swsh12pt5-GG70','sv3pt5-175','sv3pt5-170','sv3pt5-166','sv3pt5-168','swsh7-218','swsh12pt5-GG35'].sort());
 });
 it.each([
  ['sv3pt5-198','sv3pt5/200_hires.png','200/165'],
  ['sv3pt5-197','sv3pt5/198_hires.png','198/165'],
  ['sv3pt5-175','sv3pt5/188_hires.png','188/165'],
  ['swsh12pt5-GG70','swsh12pt5gg/GG70_hires.png','GG70/GG70'],
  ['swsh12pt5-GG35','swsh12pt5gg/GG35_hires.png','GG35/GG70'],
 ])('uses the verified image and number for %s', (id, image, number) => {
  expect(card(id).image).toBe(`https://images.pokemontcg.io/${image}`);
  expect(card(id).number).toBe(number);
 });
 it.each([
  ['Charizard ex',330,'Vórtice Explosivo · 330'],
  ['Pikachu',60,'Soco Pika · 50'],
  ['Blastoise ex',330,'Canhões Gêmeos · 140×'],
  ['Venusaur ex',340,'Chicote Perigoso · 150'],
  ['Umbreon VMAX',310,'Maxiescuridão · 160'],
  ['Arceus VSTAR',280,'Nova Trindade · 200'],
  ['Alakazam ex',310,'Mão Dimensional · 120'],
  ['Squirtle',60,'Cabeçada · 20'],
  ['Bulbasaur',70,'Semente Sugadora · 20'],
  ['Charmander',70,'Sopro de Fogo Constante · 30'],
  ['Rayquaza VMAX',320,'Maxiexplosão · 20+'],
  ['Leafeon VSTAR',260,'Guarda Folha · 180'],
 ])('matches printed hp and attack for %s', (name, hp, attack) => {
  const c = cards.find(x => x.name === name)!;
  expect(c.hp).toBe(hp);
  expect(c.attack).toBe(attack);
 });
});
