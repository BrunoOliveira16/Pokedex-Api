import { useNavigate } from 'react-router-dom';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';
import { EvolutionChain } from './components/EvolutionChain';
import { StatBar } from './components/StatBar';
import {
  AbilitiesList,
  AbilityBadge,
  BackButton,
  DescriptionText,
  DetailsCard,
  DetailsContainer,
  HeaderInfo,
  HeroImage,
  HeroSection,
  MetricItem,
  MetricLabel,
  MetricsGrid,
  MetricValue,
  NameGroup,
  PokemonNumber,
  PokemonTitle,
  SectionBlock,
  SectionTitle,
  StatusDescription,
  StatusMessage,
  StatusTitle,
  TopNav,
  TypesRow,
} from './styled';
import { useDetailsViewModel } from './viewModel';

export interface DetailsViewProps {
  pokemonId?: string | number | null;
  onBack?: () => void;
  onSelectPokemon?: (id: number) => void;
}

export const DetailsView = ({
  pokemonId,
  onBack,
  onSelectPokemon,
}: DetailsViewProps = {}) => {
  const { pokemon, isLoading, error, handleRetry, handleGoBack } =
    useDetailsViewModel(pokemonId);
  const navigate = useNavigate();

  const handleBack = onBack ?? handleGoBack;
  const handleSelectEvolution =
    onSelectPokemon ??
    ((id: number) => {
      navigate(`/pokemon/${id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  // --- Sub-renderers ---

  const renderTopNav = () => (
    <TopNav>
      <BackButton type="button" onClick={handleBack} aria-label="Voltar">
        ← Voltar
      </BackButton>
    </TopNav>
  );

  const renderLoading = () => (
    <StatusMessage>
      <Loader text="Carregando detalhes do Pokémon..." size={56} />
    </StatusMessage>
  );

  const renderError = () => (
    <StatusMessage>
      <StatusTitle>Ops! Não conseguimos carregar este Pokémon.</StatusTitle>
      <StatusDescription>{error}</StatusDescription>
      <Button variant="secondary" onClick={handleRetry}>
        Tentar novamente
      </Button>
    </StatusMessage>
  );

  const renderContent = () => {
    if (!pokemon) return null;

    const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
    const genderText = pokemon.genderRate.isGenderless
      ? 'Assexuado'
      : `♂ ${pokemon.genderRate.maleRate}% / ♀ ${pokemon.genderRate.femaleRate}%`;

    return (
      <>
        <HeaderInfo>
          <NameGroup>
            <PokemonTitle>{pokemon.name}</PokemonTitle>
            <TypesRow>
              {pokemon.types.map((type) => (
                <Badge key={type} type={type} />
              ))}
            </TypesRow>
          </NameGroup>
          <PokemonNumber>{formattedId}</PokemonNumber>
        </HeaderInfo>

        <HeroSection>
          <HeroImage
            src={pokemon.photo}
            alt={pokemon.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/pokeball.svg';
            }}
          />
        </HeroSection>

        <DetailsCard>
          {pokemon.description && (
            <SectionBlock>
              <DescriptionText>{pokemon.description}</DescriptionText>
            </SectionBlock>
          )}

          <SectionBlock>
            <SectionTitle>Sobre</SectionTitle>
            <MetricsGrid>
              <MetricItem>
                <MetricLabel>Altura</MetricLabel>
                <MetricValue>{pokemon.height.toFixed(1)} m</MetricValue>
              </MetricItem>
              <MetricItem>
                <MetricLabel>Peso</MetricLabel>
                <MetricValue>{pokemon.weight.toFixed(1)} kg</MetricValue>
              </MetricItem>
              <MetricItem>
                <MetricLabel>Categoria</MetricLabel>
                <MetricValue>{pokemon.genus || 'Desconhecida'}</MetricValue>
              </MetricItem>
              <MetricItem>
                <MetricLabel>Gênero</MetricLabel>
                <MetricValue>{genderText}</MetricValue>
              </MetricItem>
            </MetricsGrid>
          </SectionBlock>

          {pokemon.abilities.length > 0 && (
            <SectionBlock>
              <SectionTitle>Habilidades</SectionTitle>
              <AbilitiesList>
                {pokemon.abilities.map((ability) => (
                  <AbilityBadge key={ability}>{ability}</AbilityBadge>
                ))}
              </AbilitiesList>
            </SectionBlock>
          )}

          <SectionBlock>
            <SectionTitle>Estatísticas Base</SectionTitle>
            <StatBar label="HP" value={pokemon.stats.hp} statName="hp" />
            <StatBar label="ATK" value={pokemon.stats.atk} statName="atk" />
            <StatBar label="DEF" value={pokemon.stats.def} statName="def" />
            <StatBar label="SATK" value={pokemon.stats.satk} statName="satk" />
            <StatBar label="SDEF" value={pokemon.stats.sdef} statName="sdef" />
            <StatBar label="SPD" value={pokemon.stats.spd} statName="spd" />
          </SectionBlock>

          <SectionBlock>
            <SectionTitle>Evoluções</SectionTitle>
            <EvolutionChain
              chain={pokemon.evolutionChain}
              currentPokemonId={pokemon.id}
              onSelectPokemon={handleSelectEvolution}
            />
          </SectionBlock>
        </DetailsCard>
      </>
    );
  };

  return (
    <DetailsContainer $mainType={pokemon?.mainType}>
      {renderTopNav()}
      {isLoading && renderLoading()}
      {!isLoading && error && renderError()}
      {!isLoading && !error && renderContent()}
    </DetailsContainer>
  );
};
