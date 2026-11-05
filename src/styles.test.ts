import { describe, expect, it } from 'vitest';
import css from './styles.css?raw';
const token = (name: string) => {
 const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
 if (!match) throw new Error(`Variável ausente: --${name}`);
 return match[1];
};
const luminance = (hex: string) => {
 const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
 return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
 const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
 return (high + 0.05) / (low + 0.05);
};
describe('visual rules', () => {
 it('never sets text below 12px', () => {
  const sizes = [...css.matchAll(/font-size:\s*([\d.]+)(px|rem|em)/g)].map(m => m[2] === 'px' ? Number(m[1]) : Number(m[1]) * 16);
  expect(sizes.length).toBeGreaterThan(5);
  expect(sizes.filter(s => s < 12)).toEqual([]);
 });
 it.each([
  ['text','bg'],['text','surface'],['text-muted','bg'],['text-muted','surface'],['navy','yellow'],['green','surface'],['text','yellow-soft'],['green-strong','green-soft'],['green-strong','bg'],
 ])('meets contrast AA: %s on %s', (a, b) => {
  expect(contrast(token(a), token(b))).toBeGreaterThanOrEqual(4.5);
 });
 it.each(['green','navy'])('meets contrast AA: white on %s', a => {
  expect(contrast('#ffffff', token(a))).toBeGreaterThanOrEqual(4.5);
 });
 it('keeps focus and reduced motion', () => {
  expect(css).toContain(':focus-visible');
  expect(css).toContain('prefers-reduced-motion');
 });
 it('does not hardcode the old brand', () => {
  expect(css.toLowerCase()).not.toContain('minha coleção');
 });
});
