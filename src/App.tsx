import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from './styles/global';
import { theme } from './styles/theme';
import { DetailsView } from './views/Details';
import { HomeView } from './views/Home';

const HomeRoute = () => {
  const navigate = useNavigate();

  const handleSelectPokemon = (id: number) => {
    navigate(`/pokemon/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <HomeView onSelectPokemon={handleSelectPokemon} />;
};

const DetailsRoute = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleSelectPokemon = (newId: number) => {
    navigate(`/pokemon/${newId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DetailsView
      pokemonId={id}
      onBack={handleBack}
      onSelectPokemon={handleSelectPokemon}
    />
  );
};

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/pokemon/:id" element={<DetailsRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
};
