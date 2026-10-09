import React from 'react';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { GenerationTabs } from './components/GenerationTabs';
import { PokemonCard } from './components/PokemonCard';
import { SearchBar } from './components/SearchBar';
import {
  HomeContainer,
  MainContent,
  PaginationWrapper,
  PokemonGrid,
  StatusDescription,
  StatusMessage,
  StatusTitle,
} from './styled';
import { useHomeViewModel } from './viewModel';

export const HomeView: React.FC = () => {
  const {
    filteredPokemons,
    isLoading,
    isLoadingMore,
    error,
    selectedGen,
    generations,
    searchQuery,
    hasMore,
    handleSelectGeneration,
    handleLoadMore,
    handleSearchChange,
    handleClearSearch,
    handleRetry,
  } = useHomeViewModel();

  // --- Render Functions ---

  const renderLoading = () => (
    <Loader text={`Carregando Pokémon da ${selectedGen.label}...`} />
  );

  const renderError = () => (
    <StatusMessage>
      <StatusTitle>Ops! Algo deu errado.</StatusTitle>
      <StatusDescription>{error}</StatusDescription>
      <Button variant="secondary" onClick={handleRetry}>
        Tentar novamente
      </Button>
    </StatusMessage>
  );

  const renderEmpty = () => (
    <StatusMessage>
      <StatusTitle>Nenhum Pokémon encontrado</StatusTitle>
      <StatusDescription>
        Não encontramos resultados para "{searchQuery}". Tente outro nome ou número.
      </StatusDescription>
      <Button variant="outline" onClick={handleClearSearch}>
        Limpar busca
      </Button>
    </StatusMessage>
  );

  const renderPokemonGrid = () => (
    <>
      <PokemonGrid>
        {filteredPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </PokemonGrid>

      {hasMore && (
        <PaginationWrapper>
          <Button
            variant="primary"
            size="lg"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Carregando mais...' : 'Carregar Mais'}
          </Button>
        </PaginationWrapper>
      )}
    </>
  );

  const renderContent = () => {
    if (isLoading) return renderLoading();
    if (error) return renderError();
    if (filteredPokemons.length === 0) return renderEmpty();
    return renderPokemonGrid();
  };

  return (
    <HomeContainer>
      <Header />

      <MainContent>
        <GenerationTabs
          generations={generations}
          selectedGenId={selectedGen.id}
          onSelectGen={handleSelectGeneration}
          disabled={isLoading}
        />

        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
        />

        {renderContent()}
      </MainContent>
    </HomeContainer>
  );
};
