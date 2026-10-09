import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { pokeApiService } from '../../../models/pokeApi.service';
import { PokemonDetails } from '../../../models/pokemon.model';
import { useDetailsViewModel } from './useDetailsViewModel';

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

describe('useDetailsViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with loading true and loads pokemon details successfully', async () => {
    const getDetailsSpy = vi
      .spyOn(pokeApiService, 'getPokemonDetails')
      .mockResolvedValueOnce(mockPokemonDetails);

    const { result } = renderHook(() => useDetailsViewModel(25));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getDetailsSpy).toHaveBeenCalledWith(25);
    expect(result.current.pokemon).toEqual(mockPokemonDetails);
    expect(result.current.error).toBeNull();
  });

  it('handles API errors gracefully and updates error state', async () => {
    vi.spyOn(pokeApiService, 'getPokemonDetails').mockRejectedValueOnce(
      new Error('Pokémon não encontrado')
    );

    const { result } = renderHook(() => useDetailsViewModel('mewtwo'));

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

    const { result } = renderHook(() => useDetailsViewModel(999));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBe('Falha ao carregar detalhes do Pokémon');
  });

  it('does not fetch and keeps default null state when idOrName is null or empty', async () => {
    const getDetailsSpy = vi.spyOn(pokeApiService, 'getPokemonDetails');

    const { result } = renderHook(() => useDetailsViewModel(null));

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

    const { result } = renderHook(() => useDetailsViewModel(25));

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
});
