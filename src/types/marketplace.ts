export type Player = {id:string;name:string;avatarId:string;city:string;bio:string};
export type Listing = {id:string;cardId:string;sellerId:string;price:number;condition:string;language:string;edition:string;description:string;status:'active'|'sold'|'withdrawn';createdAt:string};
export type Order = {id:string;listingId:string;price:number;createdAt:string};
export type MarketplaceState = {listings:Listing[];friends:string[];orders:Order[]};
