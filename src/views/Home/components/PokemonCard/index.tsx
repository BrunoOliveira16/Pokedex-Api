import { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '../../../../components/Badge';
import { Pokemon } from '../../../../models/pokemon.model';
import {
  CardContainer,
  HeaderRow,
  ImageContainer,
  PokemonImage,
  PokemonName,
  PokemonNumber,
  TypesRow,
} from './styled';

export interface PokemonCardProps {
  pokemon: Pokemon;
  onSelectPokemon?: (id: number) => void;
}

export const PokemonCard = ({ pokemon, onSelectPokemon }: PokemonCardProps) => {
  const navigate = useNavigate();
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

  const handleSelect = () => {
    if (onSelectPokemon) {
      onSelectPokemon(pokemon.id);
    } else {
      navigate(`/pokemon/${pokemon.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
  };

  return (
    <CardContainer
      $mainType={pokemon.mainType}
      $isClickable={true}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes de ${pokemon.name}`}
    >
      <HeaderRow>
        <PokemonName>{pokemon.name}</PokemonName>
        <PokemonNumber>{formattedId}</PokemonNumber>
      </HeaderRow>

      <ImageContainer>
        <PokemonImage
          src={pokemon.photo}
          alt={pokemon.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/pokeball.svg';
          }}
        />
      </ImageContainer>

      <TypesRow>
        {pokemon.types.map((type) => (
          <Badge key={type} type={type} />
        ))}
      </TypesRow>
    </CardContainer>
  );
};
