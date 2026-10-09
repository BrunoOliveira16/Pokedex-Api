import { useCallback, useEffect, useState } from 'react';

import { pokeApiService } from '../../../models/pokeApi.service';
import { PokemonDetails } from '../../../models/pokemon.model';

export interface DetailsViewModel {
  pokemon: PokemonDetails | null;
  isLoading: boolean;
  error: string | null;
  handleRetry: () => void;
}

export const useDetailsViewModel = (
  idOrName?: string | number | null
): DetailsViewModel => {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(idOrName));
  const [error, setError] = useState<string | null>(null);

  const loadPokemonDetails = useCallback(async (identifier: string | number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await pokeApiService.getPokemonDetails(identifier);
      setPokemon(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Falha ao carregar detalhes do Pokémon';
      setError(message);
      setPokemon(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (idOrName !== undefined && idOrName !== null && String(idOrName).trim() !== '') {
      loadPokemonDetails(idOrName);
    } else {
      setPokemon(null);
      setIsLoading(false);
      setError(null);
    }
  }, [idOrName, loadPokemonDetails]);

  const handleRetry = useCallback(() => {
    if (idOrName !== undefined && idOrName !== null && String(idOrName).trim() !== '') {
      loadPokemonDetails(idOrName);
    }
  }, [idOrName, loadPokemonDetails]);

  return {
    pokemon,
    isLoading,
    error,
    handleRetry,
  };
};
