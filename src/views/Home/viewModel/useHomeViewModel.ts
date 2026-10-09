import { useCallback, useEffect, useMemo, useState } from 'react';

import { pokeApiService } from '../../../models/pokeApi.service';
import { GenerationConfig, GENERATIONS, Pokemon } from '../../../models/pokemon.model';

const BATCH_SIZE = 35;

export interface HomeViewModel {
  pokemons: Pokemon[];
  filteredPokemons: Pokemon[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  selectedGen: GenerationConfig;
  generations: GenerationConfig[];
  searchQuery: string;
  hasMore: boolean;
  handleSelectGeneration: (gen: GenerationConfig) => void;
  handleLoadMore: () => void;
  handleSearchChange: (query: string) => void;
  handleClearSearch: () => void;
  handleRetry: () => void;
}

export const useHomeViewModel = (): HomeViewModel => {
  const [selectedGen, setSelectedGen] = useState<GenerationConfig>(GENERATIONS[0]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const maxRecordsForGen = selectedGen.limit;

  // Load initial batch for a generation
  const loadGenerationInitial = useCallback(async (gen: GenerationConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const initialLimit = Math.min(BATCH_SIZE, gen.limit);
      const data = await pokeApiService.getPokemons(gen.offset, initialLimit);
      setPokemons(data);
      setCurrentOffset(gen.offset + initialLimit);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao carregar Pokémons';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // When generation changes, fetch initial batch
  useEffect(() => {
    loadGenerationInitial(selectedGen);
  }, [selectedGen, loadGenerationInitial]);

  // Load more pokemons within current generation
  const handleLoadMore = useCallback(async () => {
    const loadedCount = pokemons.length;
    if (loadedCount >= maxRecordsForGen || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      const remaining = maxRecordsForGen - loadedCount;
      const nextLimit = Math.min(BATCH_SIZE, remaining);
      const nextData = await pokeApiService.getPokemons(currentOffset, nextLimit);

      setPokemons((prev) => [...prev, ...nextData]);
      setCurrentOffset((prev) => prev + nextLimit);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Falha ao carregar mais Pokémons';
      setError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [pokemons.length, maxRecordsForGen, isLoadingMore, currentOffset]);

  const handleSelectGeneration = useCallback(
    (gen: GenerationConfig) => {
      if (gen.id === selectedGen.id) return;
      setSearchQuery('');
      setSelectedGen(gen);
    },
    [selectedGen.id]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleRetry = useCallback(() => {
    loadGenerationInitial(selectedGen);
  }, [loadGenerationInitial, selectedGen]);

  // Client-side search filter (name, id, or type)
  const filteredPokemons = useMemo(() => {
    if (!searchQuery.trim()) {
      return pokemons;
    }
    const query = searchQuery.toLowerCase().trim();
    return pokemons.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(query);
      const matchesId = String(p.id).includes(query);
      const matchesType = p.types.some((t) => t.toLowerCase().includes(query));
      return matchesName || matchesId || matchesType;
    });
  }, [pokemons, searchQuery]);

  const hasMore = useMemo(() => {
    if (searchQuery.trim()) return false;
    return pokemons.length < maxRecordsForGen;
  }, [pokemons.length, maxRecordsForGen, searchQuery]);

  return {
    pokemons,
    filteredPokemons,
    isLoading,
    isLoadingMore,
    error,
    selectedGen,
    generations: GENERATIONS,
    searchQuery,
    hasMore,
    handleSelectGeneration,
    handleLoadMore,
    handleSearchChange,
    handleClearSearch,
    handleRetry,
  };
};
