export type Card = { id: string; name: string; set: string; number: string; rarity: string; type: string; price: number; image: string; hp: number; attack: string };
export type CardDetails = { condition: string; language: string; edition: string };
export type Entry = { cardId: string; quantity: number; condition: string; language: string; edition: string; addedAt: string };
export type Settings = { currency: 'BRL' | 'USD' | 'JPY'; language: 'pt-BR' | 'en-US' };
export type CollectionState = { entries: Entry[]; favorites: string[]; settings: Settings };
export type Page = 'home' | 'collection' | 'sets' | 'events' | 'profile' | 'settings';
