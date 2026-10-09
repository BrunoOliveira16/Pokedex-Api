import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { pokeApiService } from '../../../models/pokeApi.service';
import { GenerationConfig, GENERATIONS, Pokemon } from '../../../models/pokemon.model';

const BATCH_SIZE = 35;

export const parseGenerationParam = (param: string | null): GenerationConfig => {
  if (!param) return GENERATIONS[0];
  const normalized = param.toLowerCase().trim();
  const byId = GENERATIONS.find((g) => g.id.toLowerCase() === normalized);
  if (byId) return byId;
  const byGenNumber = GENERATIONS.find((g) => g.id.toLowerCase() === `gen${normalized}`);
  if (byGenNumber) return byGenNumber;
  return GENERATIONS[0];
};

export const formatGenerationParam = (gen: GenerationConfig): string => {
  if (gen.id.startsWith('gen')) {
    return gen.id.replace('gen', '');
  }
  return gen.id;
};

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
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedGen, setSelectedGen] = useState<GenerationConfig>(() =>
    parseGenerationParam(searchParams.get('gen'))
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    () => searchParams.get('search') || ''
  );

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const maxRecordsForGen = selectedGen.limit;

  // Sync state if URL changes externally (e.g. browser history back/forward)
  const urlGenParam = searchParams.get('gen');
  const urlSearchParam = searchParams.get('search') || '';

  useEffect(() => {
    const matchedGen = parseGenerationParam(urlGenParam);
    if (matchedGen.id !== selectedGen.id) {
      setSelectedGen(matchedGen);
    }
  }, [urlGenParam, selectedGen.id]);

  useEffect(() => {
    if (urlSearchParam !== searchQuery) {
      setSearchQuery(urlSearchParam);
    }
  }, [urlSearchParam, searchQuery]);

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

      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('gen', formatGenerationParam(gen));
      nextParams.delete('search');
      setSearchParams(nextParams, { replace: true });
    },
    [selectedGen.id, searchParams, setSearchParams]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);

      const nextParams = new URLSearchParams(searchParams);
      if (query.trim()) {
        nextParams.set('search', query);
      } else {
        nextParams.delete('search');
      }
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('search');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

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
