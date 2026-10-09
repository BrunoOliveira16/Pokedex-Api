import { fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';
import { pokeApiService } from './models/pokeApi.service';
import { Pokemon, PokemonDetails } from './models/pokemon.model';
import { render, screen } from './test/test-utils';

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  types: ['grass', 'poison'],
  mainType: 'grass',
  photo: 'https://img/bulbasaur.png',
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
};

const mockDetails: PokemonDetails = {
  ...mockPokemon,
  description: 'A strange seed was planted on its back at birth.',
  genus: 'Seed Pokémon',
  genderRate: {
    maleRate: 87.5,
    femaleRate: 12.5,
    isGenderless: false,
  },
  captureRate: 45,
  baseHappiness: 70,
  growthRate: 'medium-slow',
  eggGroups: ['monster', 'plant'],
  evolutionChainUrl: 'https://pokeapi.co/api/v2/evolution-chain/1/',
  isLegendary: false,
  isMythical: false,
  evolutionChain: {
    id: 1,
    name: 'bulbasaur',
    photo: 'https://img/bulbasaur.png',
    minLevel: null,
    trigger: null,
    item: null,
    evolvesTo: [
      {
        id: 2,
        name: 'ivysaur',
        photo: 'https://img/ivysaur.png',
        minLevel: 16,
        trigger: 'level-up',
        item: null,
        evolvesTo: [],
      },
    ],
  },
};

describe('App routing and navigation integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
  });

  it('renders HomeView on "/" and navigates to DetailsView upon card click, then back to home', async () => {
    vi.spyOn(pokeApiService, 'getPokemons').mockResolvedValue([mockPokemon]);
    vi.spyOn(pokeApiService, 'getPokemonDetails').mockResolvedValue(mockDetails);

    render(<App />, { initialEntries: ['/'] });

    // Wait for Pokémon list in HomeView to load
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    // Click Pokémon card
    const card = screen.getByRole('button', { name: /ver detalhes de bulbasaur/i });
    fireEvent.click(card);

    // DetailsView should load
    await waitFor(() => {
      expect(screen.getByText('Seed Pokémon')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();

    // Click back button
    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));

    // Should return to HomeView
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/buscar pokémon/i)).toBeInTheDocument();
    });
  });

  it('supports direct deep linking to "/pokemon/:id"', async () => {
    vi.spyOn(pokeApiService, 'getPokemonDetails').mockResolvedValue(mockDetails);

    render(<App />, { initialEntries: ['/pokemon/1'] });

    await waitFor(() => {
      expect(screen.getByText('Seed Pokémon')).toBeInTheDocument();
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'bulbasaur' })
    ).toBeInTheDocument();
  });

  it('redirects unknown routes to home ("/")', async () => {
    vi.spyOn(pokeApiService, 'getPokemons').mockResolvedValue([mockPokemon]);

    render(<App />, { initialEntries: ['/unknown-route'] });

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/buscar pokémon/i)).toBeInTheDocument();
    });
  });
});
