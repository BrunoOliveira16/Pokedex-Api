import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { pokeApiService } from '../../../models/pokeApi.service';
import { GENERATIONS, Pokemon } from '../../../models/pokemon.model';
import { useHomeViewModel } from './useHomeViewModel';

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

describe('useHomeViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches an initial batch of pokemons on mount based on BATCH_SIZE (35)', async () => {
    const mockList = Array.from({ length: 35 }, (_, i) =>
      createMockPokemon(i + 1, `pokemon-${i + 1}`)
    );
    const getPokemonsSpy = vi
      .spyOn(pokeApiService, 'getPokemons')
      .mockResolvedValueOnce(mockList);

    const { result } = renderHook(() => useHomeViewModel());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getPokemonsSpy).toHaveBeenCalledWith(0, 35);
    expect(result.current.pokemons).toHaveLength(35);
    expect(result.current.filteredPokemons).toHaveLength(35);
    expect(result.current.hasMore).toBe(true);
  });

  it('loads the next batch of pokemons when handleLoadMore is called', async () => {
    const firstBatch = Array.from({ length: 35 }, (_, i) =>
      createMockPokemon(i + 1, `pokemon-${i + 1}`)
    );
    const secondBatch = Array.from({ length: 35 }, (_, i) =>
      createMockPokemon(i + 36, `pokemon-${i + 36}`)
    );

    const getPokemonsSpy = vi
      .spyOn(pokeApiService, 'getPokemons')
      .mockResolvedValueOnce(firstBatch)
      .mockResolvedValueOnce(secondBatch);

    const { result } = renderHook(() => useHomeViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleLoadMore();
    });

    expect(getPokemonsSpy).toHaveBeenNthCalledWith(1, 0, 35);
    expect(getPokemonsSpy).toHaveBeenNthCalledWith(2, 35, 35);
    expect(result.current.pokemons).toHaveLength(70);
  });

  it('filters pokemons by name, id or type using searchQuery', async () => {
    const p1 = createMockPokemon(1, 'bulbasaur');
    const p2 = {
      ...createMockPokemon(4, 'charmander'),
      types: ['fire'],
      mainType: 'fire',
    };

    vi.spyOn(pokeApiService, 'getPokemons').mockResolvedValueOnce([p1, p2]);

    const { result } = renderHook(() => useHomeViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleSearchChange('char');
    });

    expect(result.current.filteredPokemons).toEqual([p2]);
    expect(result.current.hasMore).toBe(false);

    act(() => {
      result.current.handleClearSearch();
    });

    expect(result.current.filteredPokemons).toEqual([p1, p2]);
  });

  it('switches generation and resets pokemon list and search query', async () => {
    const gen1List = [createMockPokemon(1, 'bulbasaur')];
    const gen2List = [createMockPokemon(152, 'chikorita')];

    const getPokemonsSpy = vi
      .spyOn(pokeApiService, 'getPokemons')
      .mockResolvedValueOnce(gen1List)
      .mockResolvedValueOnce(gen2List);

    const { result } = renderHook(() => useHomeViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleSearchChange('bulba');
      result.current.handleSelectGeneration(GENERATIONS[1]);
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedGen).toEqual(GENERATIONS[1]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getPokemonsSpy).toHaveBeenNthCalledWith(1, 0, 35);
    expect(getPokemonsSpy).toHaveBeenNthCalledWith(2, GENERATIONS[1].offset, 35);
    expect(result.current.pokemons).toEqual(gen2List);
  });

  it('handles errors and retries gracefully', async () => {
    const getPokemonsSpy = vi
      .spyOn(pokeApiService, 'getPokemons')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce([createMockPokemon(1, 'bulbasaur')]);

    const { result } = renderHook(() => useHomeViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');

    act(() => {
      result.current.handleRetry();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(getPokemonsSpy).toHaveBeenCalledTimes(2);
  });
});
