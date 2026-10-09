import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { pokeApiService } from '../../../models/pokeApi.service';
import { PokemonDetails } from '../../../models/pokemon.model';
import { useDetailsViewModel } from './useDetailsViewModel';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockPokemonDetails: PokemonDetails = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  mainType: 'electric',
  photo: 'https://img/pikachu.png',
  height: 0.4,
  weight: 6,
  abilities: ['static'],
  stats: {
    hp: 35,
    atk: 55,
    def: 40,
    satk: 50,
    sdef: 50,
    spd: 90,
  },
  description: 'When several of these POKéMON gather...',
  genus: 'Mouse Pokémon',
  genderRate: {
    maleRate: 50,
    femaleRate: 50,
    isGenderless: false,
  },
  captureRate: 190,
  baseHappiness: 70,
  growthRate: 'medium-fast',
  eggGroups: ['field', 'fairy'],
  evolutionChainUrl: 'https://pokeapi.co/api/v2/evolution-chain/10/',
  isLegendary: false,
  isMythical: false,
};

const createRouteWrapper = (initialEntry: string) => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      MemoryRouter,
      { initialEntries: [initialEntry] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, {
          path: '/pokemon/:id',
          element: React.createElement(React.Fragment, null, children),
        }),
        React.createElement(Route, {
          path: '*',
          element: React.createElement(React.Fragment, null, children),
        })
      )
    );
};

describe('useDetailsViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads id from router params and loads pokemon details successfully', async () => {
    const getDetailsSpy = vi
      .spyOn(pokeApiService, 'getPokemonDetails')
      .mockResolvedValueOnce(mockPokemonDetails);

    const { result } = renderHook(() => useDetailsViewModel(), {
      wrapper: createRouteWrapper('/pokemon/25'),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getDetailsSpy).toHaveBeenCalledWith('25');
    expect(result.current.pokemon).toEqual(mockPokemonDetails);
    expect(result.current.error).toBeNull();
  });

  it('accepts an explicit identifier override instead of router params', async () => {
    const getDetailsSpy = vi
      .spyOn(pokeApiService, 'getPokemonDetails')
      .mockResolvedValueOnce(mockPokemonDetails);

    const { result } = renderHook(() => useDetailsViewModel(25), {
      wrapper: createRouteWrapper('/pokemon/999'),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getDetailsSpy).toHaveBeenCalledWith(25);
    expect(result.current.pokemon).toEqual(mockPokemonDetails);
  });

  it('handles API errors gracefully and updates error state', async () => {
    vi.spyOn(pokeApiService, 'getPokemonDetails').mockRejectedValueOnce(
      new Error('Pokémon não encontrado')
    );

    const { result } = renderHook(() => useDetailsViewModel(), {
      wrapper: createRouteWrapper('/pokemon/mewtwo'),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBe('Pokémon não encontrado');
  });

  it('handles unknown non-Error exceptions with default fallback message', async () => {
    vi.spyOn(pokeApiService, 'getPokemonDetails').mockRejectedValueOnce(
      'Network crash string'
    );

    const { result } = renderHook(() => useDetailsViewModel(), {
      wrapper: createRouteWrapper('/pokemon/999'),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBe('Falha ao carregar detalhes do Pokémon');
  });

  it('keeps default null state when no id is provided in route or args', async () => {
    const getDetailsSpy = vi.spyOn(pokeApiService, 'getPokemonDetails');

    const { result } = renderHook(() => useDetailsViewModel(), {
      wrapper: createRouteWrapper('/'),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBeNull();
    expect(getDetailsSpy).not.toHaveBeenCalled();
  });

  it('retries fetching data when handleRetry is called', async () => {
    const getDetailsSpy = vi
      .spyOn(pokeApiService, 'getPokemonDetails')
      .mockRejectedValueOnce(new Error('Falha temporária de rede'))
      .mockResolvedValueOnce(mockPokemonDetails);

    const { result } = renderHook(() => useDetailsViewModel(), {
      wrapper: createRouteWrapper('/pokemon/25'),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBe('Falha temporária de rede');

    // Trigger retry
    act(() => {
      result.current.handleRetry();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getDetailsSpy).toHaveBeenCalledTimes(2);
    expect(result.current.pokemon).toEqual(mockPokemonDetails);
    expect(result.current.error).toBeNull();
  });

  it('triggers navigate(-1) when handleGoBack is called', () => {
    const { result } = renderHook(() => useDetailsViewModel(), {
      wrapper: createRouteWrapper('/'),
    });

    act(() => {
      result.current.handleGoBack();
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
