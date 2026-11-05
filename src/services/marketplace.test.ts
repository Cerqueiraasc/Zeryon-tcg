import { describe, expect, it } from 'vitest';
import { demoMarketplace } from '../data/marketplace';
import { buyListing, parseMarketplace, publishListing, toggleFriend } from './marketplace';
import { emptyState, parseCollection } from './collection';
const now='2026-11-05T15:00:00.000Z';
describe('MVP marketplace',()=>{
 it('round trips listings, orders and friendships through the collection backup',()=>{
  const marketplace=toggleFriend(buyListing(demoMarketplace,'demo-0',now),'ana');
  expect(parseCollection(JSON.parse(JSON.stringify({...emptyState,marketplace}))).marketplace).toEqual(marketplace);
 });
 it('prevents buying the same listing twice',()=>{const state=buyListing(demoMarketplace,'demo-0',now);expect(()=>buyListing(state,'demo-0',now)).toThrow();expect(state.orders).toHaveLength(1)});
 it('does not mutate the original offers',()=>{buyListing(demoMarketplace,'demo-0',now);expect(demoMarketplace.orders).toHaveLength(0);expect(demoMarketplace.listings[0].status).toBe('active')});
 it('publishes an owned listing and prevents buying it',()=>{const listing={...demoMarketplace.listings[0],id:'mine',sellerId:'me'};const state=publishListing(demoMarketplace,listing);expect(state.listings[0]).toEqual(listing);expect(()=>buyListing(state,'mine',now)).toThrow()});
 it('prevents buying withdrawn offers',()=>{const state={...demoMarketplace,listings:demoMarketplace.listings.map(l=>({...l,status:'withdrawn' as const}))};expect(()=>buyListing(state,'demo-0',now)).toThrow()});
 it('adds and removes a demo friend without duplication',()=>{const added=toggleFriend(demoMarketplace,'ana');expect(added.friends).toEqual(['ana']);expect(toggleFriend(added,'ana').friends).toEqual([]);expect(()=>toggleFriend(added,'missing')).toThrow()});
 it.each([0,-1,NaN,Infinity,1000001])('rejects invalid prices: %s',price=>{expect(()=>publishListing(demoMarketplace,{...demoMarketplace.listings[0],id:'mine',sellerId:'me',price})).toThrow()});
 it('rejects duplicate listings',()=>{expect(()=>parseMarketplace({...demoMarketplace,listings:[...demoMarketplace.listings,demoMarketplace.listings[0]]})).toThrow()});
 it('rejects forged order values',()=>{const purchased=buyListing(demoMarketplace,'demo-0',now);expect(()=>parseMarketplace({...purchased,orders:purchased.orders.map(o=>({...o,price:1}))})).toThrow()});
 it('keeps older collection backups compatible',()=>{expect(parseCollection(emptyState)).toEqual(emptyState)});
});
