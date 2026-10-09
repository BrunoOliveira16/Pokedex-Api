import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from './styles/global';
import { theme } from './styles/theme';
import { HomeView } from './views/Home';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <HomeView />
    </ThemeProvider>
  );
};
