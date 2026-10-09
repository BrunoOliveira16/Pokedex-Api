import { Badge } from '../../../../components/Badge';
import { ProgressBar } from '../../../../components/ProgressBar';
import { Pokemon } from '../../../../models/pokemon.model';
import {
  AbilitiesContainer,
  AbilitiesList,
  AbilityTag,
  CardContainer,
  HeaderRow,
  ImageContainer,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  PokemonImage,
  PokemonName,
  PokemonNumber,
  StatsContainer,
  StatsTitle,
  TypesRow,
} from './styled';

export interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

  return (
    <CardContainer $mainType={pokemon.mainType}>
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

      <HeaderRow>
        <PokemonName>{pokemon.name}</PokemonName>
        <PokemonNumber>{formattedId}</PokemonNumber>
      </HeaderRow>

      <TypesRow>
        {pokemon.types.map((type) => (
          <Badge key={type} type={type} />
        ))}
      </TypesRow>

      <InfoGrid>
        <InfoItem>
          <InfoLabel>Altura</InfoLabel>
          <InfoValue>{pokemon.height.toFixed(1)}m</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Peso</InfoLabel>
          <InfoValue>{pokemon.weight.toFixed(1)}kg</InfoValue>
        </InfoItem>
      </InfoGrid>

      <AbilitiesContainer>
        <InfoLabel>Habilidades</InfoLabel>
        <AbilitiesList>
          {pokemon.abilities.map((ability) => (
            <AbilityTag key={ability}>{ability}</AbilityTag>
          ))}
        </AbilitiesList>
      </AbilitiesContainer>

      <StatsContainer>
        <StatsTitle $mainType={pokemon.mainType}>Base Stats</StatsTitle>
        <ProgressBar label="HP" value={pokemon.stats.hp} colorType={pokemon.mainType} />
        <ProgressBar label="ATK" value={pokemon.stats.atk} colorType={pokemon.mainType} />
        <ProgressBar label="DEF" value={pokemon.stats.def} colorType={pokemon.mainType} />
        <ProgressBar
          label="SATK"
          value={pokemon.stats.satk}
          colorType={pokemon.mainType}
        />
        <ProgressBar
          label="SDEF"
          value={pokemon.stats.sdef}
          colorType={pokemon.mainType}
        />
        <ProgressBar label="SPD" value={pokemon.stats.spd} colorType={pokemon.mainType} />
      </StatsContainer>
    </CardContainer>
  );
};
