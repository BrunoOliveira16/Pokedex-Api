import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { pokeApiService } from '../../../models/pokeApi.service';
import { GENERATIONS, Pokemon } from '../../../models/pokemon.model';
import {
  formatGenerationParam,
  parseGenerationParam,
  useHomeViewModel,
} from './useHomeViewModel';

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

const createRouterWrapper = (initialEntry = '/') => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(MemoryRouter, { initialEntries: [initialEntry] }, children);
};

describe('useHomeViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('helper functions', () => {
    it('parses generation params by number, id and fallback', () => {
      expect(parseGenerationParam('1')).toEqual(GENERATIONS[0]);
      expect(parseGenerationParam('2')).toEqual(GENERATIONS[1]);
      expect(parseGenerationParam('gen2')).toEqual(GENERATIONS[1]);
      expect(parseGenerationParam('arceus')).toEqual(GENERATIONS[8]);
      expect(parseGenerationParam(null)).toEqual(GENERATIONS[0]);
      expect(parseGenerationParam('invalid')).toEqual(GENERATIONS[0]);
    });

    it('formats generation parameter correctly', () => {
      expect(formatGenerationParam(GENERATIONS[0])).toBe('1');
      expect(formatGenerationParam(GENERATIONS[1])).toBe('2');
      expect(formatGenerationParam(GENERATIONS[8])).toBe('arceus');
    });
  });

  it('initializes with default generation 1 when gen query param is absent', async () => {
    const mockList = Array.from({ length: 35 }, (_, i) =>
      createMockPokemon(i + 1, `pokemon-${i + 1}`)
    );
    const getPokemonsSpy = vi
      .spyOn(pokeApiService, 'getPokemons')
      .mockResolvedValue(mockList);

    const { result } = renderHook(() => useHomeViewModel(), {
      wrapper: createRouterWrapper('/'),
    });

    expect(result.current.selectedGen).toEqual(GENERATIONS[0]);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getPokemonsSpy).toHaveBeenCalledWith(0, 35);
    expect(result.current.pokemons).toHaveLength(35);
  });

  it('reads pre-existing URL query params (?gen=2&search=pikachu) on mount', async () => {
    const gen2List = [
      createMockPokemon(25, 'pikachu'),
      createMockPokemon(152, 'chikorita'),
    ];
    const getPokemonsSpy = vi
      .spyOn(pokeApiService, 'getPokemons')
      .mockResolvedValue(gen2List);

    const { result } = renderHook(() => useHomeViewModel(), {
      wrapper: createRouterWrapper('/?gen=2&search=pikachu'),
    });

    expect(result.current.selectedGen).toEqual(GENERATIONS[1]);
    expect(result.current.searchQuery).toBe('pikachu');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getPokemonsSpy).toHaveBeenCalledWith(GENERATIONS[1].offset, 35);
    // Filtered by 'pikachu'
    expect(result.current.filteredPokemons).toHaveLength(1);
    expect(result.current.filteredPokemons[0].name).toBe('pikachu');
  });

  it('updates search query in state and URL search params', async () => {
    const p1 = createMockPokemon(1, 'bulbasaur');
    const p2 = {
      ...createMockPokemon(4, 'charmander'),
      types: ['fire'],
      mainType: 'fire',
    };

    vi.spyOn(pokeApiService, 'getPokemons').mockResolvedValue([p1, p2]);

    const { result } = renderHook(
      () => {
        const vm = useHomeViewModel();
        const [params] = useSearchParams();
        return { vm, params };
      },
      { wrapper: createRouterWrapper('/') }
    );

    await waitFor(() => {
      expect(result.current.vm.isLoading).toBe(false);
    });

    act(() => {
      result.current.vm.handleSearchChange('char');
    });

    expect(result.current.vm.searchQuery).toBe('char');
    expect(result.current.params.get('search')).toBe('char');
    expect(result.current.vm.filteredPokemons).toEqual([p2]);

    act(() => {
      result.current.vm.handleClearSearch();
    });

    expect(result.current.vm.searchQuery).toBe('');
    expect(result.current.params.get('search')).toBeNull();
    expect(result.current.vm.filteredPokemons).toEqual([p1, p2]);
  });

  it('updates generation in state and URL search params, resetting search', async () => {
    const gen1List = [createMockPokemon(1, 'bulbasaur')];
    const gen2List = [createMockPokemon(152, 'chikorita')];

    const getPokemonsSpy = vi
      .spyOn(pokeApiService, 'getPokemons')
      .mockImplementation(async (offset) => {
        if (offset === GENERATIONS[1].offset) return gen2List;
        return gen1List;
      });

    const { result } = renderHook(
      () => {
        const vm = useHomeViewModel();
        const [params] = useSearchParams();
        return { vm, params };
      },
      { wrapper: createRouterWrapper('/?search=bulba') }
    );

    await waitFor(() => {
      expect(result.current.vm.isLoading).toBe(false);
    });

    act(() => {
      result.current.vm.handleSelectGeneration(GENERATIONS[1]);
    });

    expect(result.current.vm.selectedGen).toEqual(GENERATIONS[1]);
    expect(result.current.params.get('gen')).toBe('2');
    expect(result.current.params.get('search')).toBeNull();
    expect(result.current.vm.searchQuery).toBe('');

    await waitFor(() => {
      expect(result.current.vm.isLoading).toBe(false);
    });

    expect(getPokemonsSpy).toHaveBeenCalledWith(GENERATIONS[1].offset, 35);
  });

  it('loads more pokemons when handleLoadMore is called', async () => {
    const firstBatch = Array.from({ length: 35 }, (_, i) =>
      createMockPokemon(i + 1, `pokemon-${i + 1}`)
    );
    const secondBatch = Array.from({ length: 35 }, (_, i) =>
      createMockPokemon(i + 36, `pokemon-${i + 36}`)
    );

    const getPokemonsSpy = vi
      .spyOn(pokeApiService, 'getPokemons')
      .mockImplementation(async (offset) => {
        if (offset === 35) return secondBatch;
        return firstBatch;
      });

    const { result } = renderHook(() => useHomeViewModel(), {
      wrapper: createRouterWrapper('/'),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleLoadMore();
    });

    expect(getPokemonsSpy).toHaveBeenCalledWith(35, 35);
    expect(result.current.pokemons).toHaveLength(70);
  });

  it('handles errors and retries gracefully', async () => {
    let callCount = 0;
    const getPokemonsSpy = vi
      .spyOn(pokeApiService, 'getPokemons')
      .mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Network error');
        }
        return [createMockPokemon(1, 'bulbasaur')];
      });

    const { result } = renderHook(() => useHomeViewModel(), {
      wrapper: createRouterWrapper('/'),
    });

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
