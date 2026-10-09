import { useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from './styles/global';
import { theme } from './styles/theme';
import { DetailsView } from './views/Details';
import { HomeView } from './views/Home';

export const App = () => {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);

  const handleSelectPokemon = (id: number) => {
    setSelectedPokemonId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedPokemonId(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {selectedPokemonId ? (
        <DetailsView
          pokemonId={selectedPokemonId}
          onBack={handleBackToHome}
          onSelectPokemon={handleSelectPokemon}
        />
      ) : (
        <HomeView onSelectPokemon={handleSelectPokemon} />
      )}
    </ThemeProvider>
  );
};
