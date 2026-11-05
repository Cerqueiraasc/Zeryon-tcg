export type AvatarOption = { id: string; name: string; category: 'Pokémon' | 'Treinadores e líderes' | 'Campeões' | 'Vilões' };
export const avatarCategories: AvatarOption['category'][] = ['Pokémon', 'Treinadores e líderes', 'Campeões', 'Vilões'];
export const avatars: AvatarOption[] = [
 {id:'pikachu',name:'Pikachu',category:'Pokémon'},
 {id:'charizard',name:'Charizard',category:'Pokémon'},
 {id:'eevee',name:'Eevee',category:'Pokémon'},
 {id:'gengar',name:'Gengar',category:'Pokémon'},
 {id:'mewtwo',name:'Mewtwo',category:'Pokémon'},
 {id:'lucario',name:'Lucario',category:'Pokémon'},
 {id:'red',name:'Red',category:'Treinadores e líderes'},
 {id:'misty',name:'Misty',category:'Treinadores e líderes'},
 {id:'brock',name:'Brock',category:'Treinadores e líderes'},
 {id:'cynthia',name:'Cynthia',category:'Campeões'},
 {id:'lance',name:'Lance',category:'Campeões'},
 {id:'giovanni',name:'Giovanni',category:'Vilões'},
 {id:'cyrus',name:'Cyrus',category:'Vilões'},
 {id:'ghetsis',name:'Ghetsis',category:'Vilões'},
];
export const findAvatar = (id?: string) => avatars.find(avatar => avatar.id === id);
