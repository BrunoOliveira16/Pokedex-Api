import { KeyboardEvent } from 'react';

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
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

  const handleClick = () => {
    onSelectPokemon?.(pokemon.id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectPokemon?.(pokemon.id);
    }
  };

  return (
    <CardContainer
      $mainType={pokemon.mainType}
      $isClickable={Boolean(onSelectPokemon)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onSelectPokemon ? 0 : undefined}
      role={onSelectPokemon ? 'button' : undefined}
      aria-label={onSelectPokemon ? `Ver detalhes de ${pokemon.name}` : undefined}
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
