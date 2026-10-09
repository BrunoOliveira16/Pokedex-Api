import { fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { pokeApiService } from '../../models/pokeApi.service';
import { Pokemon } from '../../models/pokemon.model';
import { render, screen } from '../../test/test-utils';
import { HomeView } from './index';

const createMockPokemon = (id: number, name: string): Pokemon => ({
  id,
  name,
  types: ['grass'],
  mainType: 'grass',
  photo: `https://img/${id}.png`,
  height: 0.7,
  weight: 6.9,
  abilities: ['overgrow'],
  stats: {
    hp: 45,
    atk: 49,
    def: 49,
    satk: 65,
    sdef: 65,
    spd: 45,
  },
});

describe('HomeView integration with URL search params', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default generation 1 and empty search when no query params exist', async () => {
    const gen1List = [createMockPokemon(1, 'bulbasaur')];
    vi.spyOn(pokeApiService, 'getPokemons').mockResolvedValue(gen1List);

    render(<HomeView />, { initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /buscar pokémon por nome ou número/i
    ) as HTMLInputElement;
    expect(searchInput.value).toBe('');

    // Active generation tab is 1ª Geração
    const gen1Tab = screen.getByRole('button', { name: '1ª Geração' });
    expect(gen1Tab).toBeInTheDocument();
  });

  it('reflects generation and search query from URL params (/?gen=2&search=chiko)', async () => {
    const gen2List = [
      createMockPokemon(152, 'chikorita'),
      createMockPokemon(155, 'cyndaquil'),
    ];
    const getPokemonsSpy = vi
      .spyOn(pokeApiService, 'getPokemons')
      .mockResolvedValue(gen2List);

    render(<HomeView />, { initialEntries: ['/?gen=2&search=chiko'] });

    await waitFor(() => {
      expect(screen.getByText('chikorita')).toBeInTheDocument();
    });

    // Gen 2 was fetched (offset 151)
    expect(getPokemonsSpy).toHaveBeenCalledWith(151, 35);

    // Search input reflects URL search param
    const searchInput = screen.getByPlaceholderText(
      /buscar pokémon por nome ou número/i
    ) as HTMLInputElement;
    expect(searchInput.value).toBe('chiko');

    // Filtered out non-matching pokemons
    expect(screen.queryByText('cyndaquil')).not.toBeInTheDocument();
  });

  it('updates search query and filters in real-time when typing in SearchBar', async () => {
    const pokemonList = [
      createMockPokemon(1, 'bulbasaur'),
      createMockPokemon(4, 'charmander'),
    ];
    vi.spyOn(pokeApiService, 'getPokemons').mockResolvedValue(pokemonList);

    render(<HomeView />, { initialEntries: ['/'] });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/buscar pokémon por nome ou número/i);
    fireEvent.change(searchInput, { target: { value: 'char' } });

    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
  });
});
