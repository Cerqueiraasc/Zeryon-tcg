export type Card = { id: string; name: string; set: string; number: string; rarity: string; type: string; price: number; image: string; hp: number; attack: string };
export type CardDetails = { condition: string; language: string; edition: string };
export type Entry = { cardId: string; quantity: number; condition: string; language: string; edition: string; addedAt: string };
export type Theme = 'light' | 'dark';
export type Settings = { currency: 'BRL' | 'USD' | 'JPY'; language: 'pt-BR' | 'en-US'; theme?: Theme };
export type CollectionState = { entries: Entry[]; favorites: string[]; settings: Settings; avatarId?: string; marketplace?: import('./marketplace').MarketplaceState };
export type Page = 'home' | 'collection' | 'sets' | 'events' | 'profile' | 'settings' | 'marketplace';
