import {
  EvolutionNode,
  mapRawEvolutionChainToEvolutionNode,
  mapRawPokeApiToPokemon,
  mapRawPokeApiToPokemonDetails,
  Pokemon,
  PokemonDetails,
  RawEvolutionChainResponse,
  RawPokeApiDetail,
  RawPokeApiSpecies,
} from './pokemon.model';

const BASE_URL = 'https://pokeapi.co/api/v2';

interface PokemonListResponse {
  count: number;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export const pokeApiService = {
  async getPokemonDetailByUrl(url: string): Promise<Pokemon> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar Pokémon na url: ${url}`);
    }
    const data: RawPokeApiDetail = await response.json();
    return mapRawPokeApiToPokemon(data);
  },

  async getPokemonByIdOrName(query: string | number): Promise<Pokemon> {
    const response = await fetch(
      `${BASE_URL}/pokemon/${String(query).toLowerCase().trim()}`
    );
    if (!response.ok) {
      throw new Error(`Pokémon não encontrado: ${query}`);
    }
    const data: RawPokeApiDetail = await response.json();
    return mapRawPokeApiToPokemon(data);
  },

  async getPokemons(offset: number, limit: number): Promise<Pokemon[]> {
    const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar lista de Pokémon: ${response.statusText}`);
    }
    const data: PokemonListResponse = await response.json();

    const detailPromises = data.results.map((item) =>
      this.getPokemonDetailByUrl(item.url)
    );

    return Promise.all(detailPromises);
  },

  async getPokemonSpecies(id: string | number): Promise<RawPokeApiSpecies> {
    const response = await fetch(
      `${BASE_URL}/pokemon-species/${String(id).toLowerCase().trim()}`
    );
    if (!response.ok) {
      throw new Error(`Erro ao buscar espécie do Pokémon: ${id}`);
    }
    const data: RawPokeApiSpecies = await response.json();
    return data;
  },

  async getEvolutionChain(url: string): Promise<EvolutionNode> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar cadeia de evolução na url: ${url}`);
    }
    const data: RawEvolutionChainResponse = await response.json();
    return mapRawEvolutionChainToEvolutionNode(data);
  },

  async getPokemonDetails(id: string | number): Promise<PokemonDetails> {
    const [pokemon, rawSpecies] = await Promise.all([
      this.getPokemonByIdOrName(id),
      this.getPokemonSpecies(id),
    ]);

    let evolutionChain: EvolutionNode | undefined;
    if (rawSpecies.evolution_chain?.url) {
      try {
        evolutionChain = await this.getEvolutionChain(rawSpecies.evolution_chain.url);
      } catch {
        evolutionChain = undefined;
      }
    }

    return mapRawPokeApiToPokemonDetails(pokemon, rawSpecies, evolutionChain);
  },
};
