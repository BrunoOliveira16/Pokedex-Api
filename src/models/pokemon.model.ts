export interface PokemonStat {
  name: 'hp' | 'atk' | 'def' | 'satk' | 'sdef' | 'spd';
  baseStat: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  mainType: string;
  photo: string;
  height: number; // in meters (divided by 10)
  weight: number; // in kg (divided by 10)
  abilities: string[];
  stats: {
    hp: number;
    atk: number;
    def: number;
    satk: number;
    sdef: number;
    spd: number;
  };
}

export interface GenerationConfig {
  id: string;
  label: string;
  offset: number;
  limit: number;
}

export const GENERATIONS: GenerationConfig[] = [
  { id: 'gen1', label: '1ª Geração', offset: 0, limit: 151 },
  { id: 'gen2', label: '2ª Geração', offset: 151, limit: 100 },
  { id: 'gen3', label: '3ª Geração', offset: 251, limit: 135 },
  { id: 'gen4', label: '4ª Geração', offset: 386, limit: 107 },
  { id: 'gen5', label: '5ª Geração', offset: 493, limit: 156 },
  { id: 'gen6', label: '6ª Geração', offset: 649, limit: 72 },
  { id: 'gen7', label: '7ª Geração', offset: 721, limit: 88 },
  { id: 'gen8', label: '8ª Geração', offset: 809, limit: 89 },
  { id: 'arceus', label: 'Arceus (Hisui)', offset: 898, limit: 7 },
  { id: 'gen9', label: '9ª Geração', offset: 905, limit: 120 },
];

export interface RawPokeApiDetail {
  id: number;
  name: string;
  types: Array<{
    slot: number;
    type: { name: string; url: string };
  }>;
  sprites: {
    other?: {
      home?: { front_default?: string };
      'official-artwork'?: { front_default?: string };
    };
    front_default?: string;
  };
  abilities: Array<{
    ability: { name: string; url: string };
  }>;
  height: number;
  weight: number;
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
}

export function mapRawPokeApiToPokemon(raw: RawPokeApiDetail): Pokemon {
  const types = raw.types.map((t) => t.type.name);
  const mainType = types[0] || 'normal';

  // Prefer high quality official home sprite, fallback to official artwork or front_default
  const photo =
    raw.sprites.other?.home?.front_default ||
    raw.sprites.other?.['official-artwork']?.front_default ||
    raw.sprites.front_default ||
    '/images/pokeball.svg';

  const abilities = raw.abilities.map((a) => a.ability.name);

  return {
    id: raw.id,
    name: raw.name,
    types,
    mainType,
    photo,
    height: raw.height / 10,
    weight: raw.weight / 10,
    abilities,
    stats: {
      hp: raw.stats[0]?.base_stat ?? 0,
      atk: raw.stats[1]?.base_stat ?? 0,
      def: raw.stats[2]?.base_stat ?? 0,
      satk: raw.stats[3]?.base_stat ?? 0,
      sdef: raw.stats[4]?.base_stat ?? 0,
      spd: raw.stats[5]?.base_stat ?? 0,
    },
  };
}
