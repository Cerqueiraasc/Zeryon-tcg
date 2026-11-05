import type { MarketplaceState, Player } from '../types/marketplace';
import { cards } from './catalog';
export const players:Player[]=[
 {id:'ana',name:'Ana Ketchum',avatarId:'misty',city:'São Paulo, SP',bio:'Coleciono as ilustrações de Kanto. Minha favorita é a Eevee!'},
 {id:'leo',name:'Leo do Charizard',avatarId:'red',city:'Curitiba, PR',bio:'Treinador de Pokémon de fogo e fã de cartas especiais.'},
 {id:'bia',name:'Bia de Sinnoh',avatarId:'cynthia',city:'Belo Horizonte, MG',bio:'Buscando completar meu checklist, uma carta de cada vez.'},
 {id:'rafa',name:'Rafa Rocket',avatarId:'giovanni',city:'Rio de Janeiro, RJ',bio:'Gengar, Mewtwo e cartas que contam boas histórias.'},
];
export const demoMarketplace:MarketplaceState={friends:[],orders:[],listings:cards.slice(0,8).map((c,i)=>({id:`demo-${i}`,cardId:c.id,sellerId:players[i%players.length].id,price:Math.round(c.price*(0.85+i*.035)),condition:i%3===0?'Pouco jogada':'Perto de nova',language:i%2?'Inglês':'Português',edition:'Normal',description:'Anúncio fictício para conhecer o fluxo de compra e venda do MVP.',status:'active',createdAt:'2026-11-05T12:00:00.000Z'}))};
