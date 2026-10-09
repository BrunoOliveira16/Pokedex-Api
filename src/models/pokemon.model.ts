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

export interface PokemonGenderRate {
  maleRate: number;
  femaleRate: number;
  isGenderless: boolean;
}

export interface EvolutionNode {
  id: number;
  name: string;
  photo: string;
  minLevel: number | null;
  trigger: string | null;
  item: string | null;
  evolvesTo: EvolutionNode[];
}

export interface PokemonSpeciesData {
  description: string;
  genus: string;
  genderRate: PokemonGenderRate;
  captureRate: number;
  baseHappiness: number;
  growthRate: string;
  eggGroups: string[];
  evolutionChainUrl: string;
  isLegendary: boolean;
  isMythical: boolean;
}

export interface PokemonDetails extends Pokemon {
  description: string;
  genus: string;
  genderRate: PokemonGenderRate;
  captureRate: number;
  baseHappiness: number;
  growthRate: string;
  eggGroups: string[];
  evolutionChainUrl: string;
  isLegendary: boolean;
  isMythical: boolean;
  evolutionChain?: EvolutionNode;
}

export interface RawFlavorTextEntry {
  flavor_text: string;
  language: { name: string; url?: string };
  version?: { name: string; url?: string };
}

export interface RawGenusEntry {
  genus: string;
  language: { name: string; url?: string };
}

export interface RawPokeApiSpecies {
  id: number;
  name: string;
  flavor_text_entries: RawFlavorTextEntry[];
  genera: RawGenusEntry[];
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  growth_rate?: { name: string; url?: string };
  egg_groups?: Array<{ name: string; url?: string }>;
  evolution_chain?: { url: string };
  is_legendary?: boolean;
  is_mythical?: boolean;
}

export interface RawEvolutionDetail {
  min_level?: number | null;
  trigger?: { name: string; url?: string };
  item?: { name: string; url?: string } | null;
}

export interface RawEvolutionNode {
  is_baby?: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: RawEvolutionDetail[];
  evolves_to: RawEvolutionNode[];
}

export interface RawEvolutionChainResponse {
  id: number;
  chain: RawEvolutionNode;
}

export function extractIdFromUrl(url: string): number {
  if (!url) return 0;
  const matches = url.match(/\/(\d+)\/?$/);
  if (matches && matches[1]) {
    return parseInt(matches[1], 10);
  }
  const parts = url.split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  const parsed = parseInt(last, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function getPokemonSpriteUrl(id: number): string {
  if (!id || id <= 0) return '/images/pokeball.svg';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
}

export function formatFlavorText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\f\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function calculateGenderRate(genderRate: number): PokemonGenderRate {
  if (genderRate === -1 || genderRate < 0) {
    return {
      maleRate: 0,
      femaleRate: 0,
      isGenderless: true,
    };
  }
  const femaleRate = (genderRate / 8) * 100;
  const maleRate = Math.max(0, 100 - femaleRate);
  return {
    maleRate,
    femaleRate,
    isGenderless: false,
  };
}

export function mapRawSpeciesToSpeciesData(raw: RawPokeApiSpecies): PokemonSpeciesData {
  const englishFlavor =
    raw.flavor_text_entries?.find((entry) => entry.language.name === 'en') ||
    raw.flavor_text_entries?.[0];
  const description = englishFlavor ? formatFlavorText(englishFlavor.flavor_text) : '';

  const englishGenus =
    raw.genera?.find((g) => g.language.name === 'en') || raw.genera?.[0];
  const genus = englishGenus ? englishGenus.genus.trim() : '';

  const genderRate = calculateGenderRate(raw.gender_rate ?? -1);
  const captureRate = raw.capture_rate ?? 0;
  const baseHappiness = raw.base_happiness ?? 0;
  const growthRate = raw.growth_rate?.name || 'medium';
  const eggGroups = (raw.egg_groups || []).map((eg) => eg.name);
  const evolutionChainUrl = raw.evolution_chain?.url || '';
  const isLegendary = Boolean(raw.is_legendary);
  const isMythical = Boolean(raw.is_mythical);

  return {
    description,
    genus,
    genderRate,
    captureRate,
    baseHappiness,
    growthRate,
    eggGroups,
    evolutionChainUrl,
    isLegendary,
    isMythical,
  };
}

export function mapRawEvolutionNodeToEvolutionNode(
  rawNode: RawEvolutionNode
): EvolutionNode {
  const id = extractIdFromUrl(rawNode.species.url);
  const details = rawNode.evolution_details?.[0];

  return {
    id,
    name: rawNode.species.name,
    photo: id > 0 ? getPokemonSpriteUrl(id) : '/images/pokeball.svg',
    minLevel: details?.min_level ?? null,
    trigger: details?.trigger?.name ?? null,
    item: details?.item?.name ?? null,
    evolvesTo: (rawNode.evolves_to || []).map(mapRawEvolutionNodeToEvolutionNode),
  };
}

export function mapRawEvolutionChainToEvolutionNode(
  raw: RawEvolutionChainResponse
): EvolutionNode {
  return mapRawEvolutionNodeToEvolutionNode(raw.chain);
}

export function flattenEvolutionChain(root: EvolutionNode): EvolutionNode[] {
  const result: EvolutionNode[] = [root];
  for (const child of root.evolvesTo) {
    result.push(...flattenEvolutionChain(child));
  }
  return result;
}

export function mapRawPokeApiToPokemonDetails(
  pokemon: Pokemon,
  rawSpecies: RawPokeApiSpecies,
  evolutionChain?: EvolutionNode
): PokemonDetails {
  const speciesData = mapRawSpeciesToSpeciesData(rawSpecies);

  return {
    ...pokemon,
    ...speciesData,
    evolutionChain,
  };
}
