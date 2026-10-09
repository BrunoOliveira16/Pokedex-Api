import { describe, expect, it } from 'vitest';

import {
  calculateGenderRate,
  EvolutionNode,
  extractIdFromUrl,
  flattenEvolutionChain,
  formatFlavorText,
  getPokemonSpriteUrl,
  mapRawEvolutionChainToEvolutionNode,
  mapRawEvolutionNodeToEvolutionNode,
  mapRawPokeApiToPokemon,
  mapRawPokeApiToPokemonDetails,
  mapRawSpeciesToSpeciesData,
  Pokemon,
  RawEvolutionChainResponse,
  RawEvolutionNode,
  RawPokeApiDetail,
  RawPokeApiSpecies,
} from './pokemon.model';

describe('pokemon.model mapping functions', () => {
  describe('extractIdFromUrl', () => {
    it('extracts ID from URL with trailing slash', () => {
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon-species/25/')).toBe(25);
    });

    it('extracts ID from URL without trailing slash', () => {
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/150')).toBe(150);
    });

    it('returns 0 for empty or invalid URL', () => {
      expect(extractIdFromUrl('')).toBe(0);
      expect(extractIdFromUrl('not-a-valid-url')).toBe(0);
    });
  });

  describe('getPokemonSpriteUrl', () => {
    it('returns home sprite URL for valid positive ID', () => {
      expect(getPokemonSpriteUrl(1)).toBe(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png'
      );
    });

    it('returns fallback pokeball icon for 0 or negative ID', () => {
      expect(getPokemonSpriteUrl(0)).toBe('/images/pokeball.svg');
      expect(getPokemonSpriteUrl(-5)).toBe('/images/pokeball.svg');
    });
  });

  describe('formatFlavorText', () => {
    it('cleans up form feeds, newlines, tabs and multiple spaces', () => {
      const rawText =
        'Spits fire that\nis hot enough to\fmelt boulders.\tKnown to cause forest fires.';
      const formatted = formatFlavorText(rawText);
      expect(formatted).toBe(
        'Spits fire that is hot enough to melt boulders. Known to cause forest fires.'
      );
    });

    it('returns empty string when input is empty', () => {
      expect(formatFlavorText('')).toBe('');
    });
  });

  describe('calculateGenderRate', () => {
    it('handles genderless pokemon (-1)', () => {
      const result = calculateGenderRate(-1);
      expect(result).toEqual({
        maleRate: 0,
        femaleRate: 0,
        isGenderless: true,
      });
    });

    it('calculates gender rates accurately for 1/8 female ratio (e.g. starters)', () => {
      const result = calculateGenderRate(1);
      expect(result).toEqual({
        maleRate: 87.5,
        femaleRate: 12.5,
        isGenderless: false,
      });
    });

    it('calculates 50/50 ratio (4/8)', () => {
      const result = calculateGenderRate(4);
      expect(result).toEqual({
        maleRate: 50,
        femaleRate: 50,
        isGenderless: false,
      });
    });

    it('calculates 100% female ratio (8/8)', () => {
      const result = calculateGenderRate(8);
      expect(result).toEqual({
        maleRate: 0,
        femaleRate: 100,
        isGenderless: false,
      });
    });
  });

  describe('mapRawSpeciesToSpeciesData', () => {
    const mockRawSpecies: RawPokeApiSpecies = {
      id: 25,
      name: 'pikachu',
      flavor_text_entries: [
        {
          flavor_text: 'Quand plusieurs de ces POKéMON se réunissent...',
          language: { name: 'fr' },
        },
        {
          flavor_text:
            'When several of\nthese POKéMON gather,\ftheir electricity could cause storms.',
          language: { name: 'en' },
        },
      ],
      genera: [
        { genus: 'Pokémon Souris', language: { name: 'fr' } },
        { genus: 'Mouse Pokémon', language: { name: 'en' } },
      ],
      gender_rate: 4,
      capture_rate: 190,
      base_happiness: 70,
      growth_rate: { name: 'medium-fast' },
      egg_groups: [{ name: 'field' }, { name: 'fairy' }],
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/10/' },
      is_legendary: false,
      is_mythical: false,
    };

    it('extracts english description, genus and normalizes species data', () => {
      const result = mapRawSpeciesToSpeciesData(mockRawSpecies);

      expect(result.description).toBe(
        'When several of these POKéMON gather, their electricity could cause storms.'
      );
      expect(result.genus).toBe('Mouse Pokémon');
      expect(result.genderRate).toEqual({
        maleRate: 50,
        femaleRate: 50,
        isGenderless: false,
      });
      expect(result.captureRate).toBe(190);
      expect(result.baseHappiness).toBe(70);
      expect(result.growthRate).toBe('medium-fast');
      expect(result.eggGroups).toEqual(['field', 'fairy']);
      expect(result.evolutionChainUrl).toBe(
        'https://pokeapi.co/api/v2/evolution-chain/10/'
      );
      expect(result.isLegendary).toBe(false);
      expect(result.isMythical).toBe(false);
    });

    it('falls back gracefully when entries are missing or empty', () => {
      const minimalSpecies: RawPokeApiSpecies = {
        id: 0,
        name: 'unknown',
        flavor_text_entries: [],
        genera: [],
        gender_rate: -1,
        capture_rate: 0,
        base_happiness: 0,
      };

      const result = mapRawSpeciesToSpeciesData(minimalSpecies);

      expect(result.description).toBe('');
      expect(result.genus).toBe('');
      expect(result.genderRate.isGenderless).toBe(true);
      expect(result.eggGroups).toEqual([]);
      expect(result.evolutionChainUrl).toBe('');
    });
  });

  describe('mapRawEvolutionNodeToEvolutionNode and flattenEvolutionChain', () => {
    const mockRawEvolutionChain: RawEvolutionChainResponse = {
      id: 10,
      chain: {
        species: {
          name: 'pichu',
          url: 'https://pokeapi.co/api/v2/pokemon-species/172/',
        },
        evolution_details: [],
        evolves_to: [
          {
            species: {
              name: 'pikachu',
              url: 'https://pokeapi.co/api/v2/pokemon-species/25/',
            },
            evolution_details: [
              {
                min_level: null,
                trigger: { name: 'happiness' },
                item: null,
              },
            ],
            evolves_to: [
              {
                species: {
                  name: 'raichu',
                  url: 'https://pokeapi.co/api/v2/pokemon-species/26/',
                },
                evolution_details: [
                  {
                    min_level: null,
                    trigger: { name: 'use-item' },
                    item: { name: 'thunder-stone' },
                  },
                ],
                evolves_to: [],
              },
            ],
          },
        ],
      },
    };

    it('maps hierarchical evolution chain into EvolutionNode tree structure', () => {
      const root = mapRawEvolutionChainToEvolutionNode(mockRawEvolutionChain);

      expect(root.id).toBe(172);
      expect(root.name).toBe('pichu');
      expect(root.minLevel).toBeNull();
      expect(root.trigger).toBeNull();
      expect(root.evolvesTo).toHaveLength(1);

      const stage2 = root.evolvesTo[0];
      expect(stage2.id).toBe(25);
      expect(stage2.name).toBe('pikachu');
      expect(stage2.trigger).toBe('happiness');
      expect(stage2.item).toBeNull();
      expect(stage2.evolvesTo).toHaveLength(1);

      const stage3 = stage2.evolvesTo[0];
      expect(stage3.id).toBe(26);
      expect(stage3.name).toBe('raichu');
      expect(stage3.trigger).toBe('use-item');
      expect(stage3.item).toBe('thunder-stone');
      expect(stage3.evolvesTo).toHaveLength(0);
    });

    it('flattens evolution tree into array correctly', () => {
      const root = mapRawEvolutionChainToEvolutionNode(mockRawEvolutionChain);
      const flattened = flattenEvolutionChain(root);

      expect(flattened).toHaveLength(3);
      expect(flattened.map((n) => n.name)).toEqual(['pichu', 'pikachu', 'raichu']);
      expect(flattened.map((n) => n.id)).toEqual([172, 25, 26]);
    });

    it('maps an individual raw evolution node', () => {
      const rawNode: RawEvolutionNode = {
        species: {
          name: 'charmander',
          url: 'https://pokeapi.co/api/v2/pokemon-species/4/',
        },
        evolution_details: [],
        evolves_to: [],
      };
      const node = mapRawEvolutionNodeToEvolutionNode(rawNode);
      expect(node.id).toBe(4);
      expect(node.name).toBe('charmander');
      expect(node.evolvesTo).toEqual([]);
    });
  });

  describe('mapRawPokeApiToPokemonDetails', () => {
    const mockRawPokemon: RawPokeApiDetail = {
      id: 25,
      name: 'pikachu',
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      sprites: {
        other: {
          home: { front_default: 'https://img/pikachu.png' },
        },
      },
      abilities: [{ ability: { name: 'static', url: '' } }],
      height: 4,
      weight: 60,
      stats: [
        { base_stat: 35, stat: { name: 'hp' } },
        { base_stat: 55, stat: { name: 'attack' } },
        { base_stat: 40, stat: { name: 'defense' } },
        { base_stat: 50, stat: { name: 'special-attack' } },
        { base_stat: 50, stat: { name: 'special-defense' } },
        { base_stat: 90, stat: { name: 'speed' } },
      ],
    };

    const mockRawSpecies: RawPokeApiSpecies = {
      id: 25,
      name: 'pikachu',
      flavor_text_entries: [
        {
          flavor_text: 'When several of these POKéMON gather...',
          language: { name: 'en' },
        },
      ],
      genera: [{ genus: 'Mouse Pokémon', language: { name: 'en' } }],
      gender_rate: 4,
      capture_rate: 190,
      base_happiness: 70,
      growth_rate: { name: 'medium-fast' },
      egg_groups: [{ name: 'field' }],
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/10/' },
      is_legendary: false,
      is_mythical: false,
    };

    const mockEvolutionNode: EvolutionNode = {
      id: 25,
      name: 'pikachu',
      photo: 'https://img/pikachu.png',
      minLevel: null,
      trigger: null,
      item: null,
      evolvesTo: [],
    };

    it('combines base Pokemon and species details into a complete PokemonDetails object', () => {
      const basePokemon: Pokemon = mapRawPokeApiToPokemon(mockRawPokemon);
      const details = mapRawPokeApiToPokemonDetails(
        basePokemon,
        mockRawSpecies,
        mockEvolutionNode
      );

      expect(details.id).toBe(25);
      expect(details.name).toBe('pikachu');
      expect(details.mainType).toBe('electric');
      expect(details.height).toBe(0.4);
      expect(details.weight).toBe(6);
      expect(details.description).toBe('When several of these POKéMON gather...');
      expect(details.genus).toBe('Mouse Pokémon');
      expect(details.evolutionChain).toEqual(mockEvolutionNode);
      expect(details.stats.spd).toBe(90);
    });
  });
});
