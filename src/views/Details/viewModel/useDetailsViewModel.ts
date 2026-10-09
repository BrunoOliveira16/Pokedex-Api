import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { pokeApiService } from '../../../models/pokeApi.service';
import { PokemonDetails } from '../../../models/pokemon.model';

export interface DetailsViewModel {
  pokemon: PokemonDetails | null;
  isLoading: boolean;
  error: string | null;
  handleRetry: () => void;
  handleGoBack: () => void;
}

export const useDetailsViewModel = (
  idOrName?: string | number | null
): DetailsViewModel => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const targetId = idOrName !== undefined && idOrName !== null ? idOrName : paramId;

  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(
    Boolean(targetId && String(targetId).trim() !== '')
  );
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
    if (targetId !== undefined && targetId !== null && String(targetId).trim() !== '') {
      loadPokemonDetails(targetId);
    } else {
      setPokemon(null);
      setIsLoading(false);
      setError(null);
    }
  }, [targetId, loadPokemonDetails]);

  const handleRetry = useCallback(() => {
    if (targetId !== undefined && targetId !== null && String(targetId).trim() !== '') {
      loadPokemonDetails(targetId);
    }
  }, [targetId, loadPokemonDetails]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    pokemon,
    isLoading,
    error,
    handleRetry,
    handleGoBack,
  };
};
