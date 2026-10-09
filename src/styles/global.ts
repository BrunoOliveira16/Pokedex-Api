import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  html {
    background: url('/images/Pokeball-wallpaper.jpg');
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
    min-height: 100%;
    scrollbar-gutter: stable;
    overflow-y: scroll;
  }

  body {
    width: 100%;
    max-width: 1560px;
    min-width: 360px;
    margin: 0 auto;
    background-color: ${({ theme }) => theme.colors.background};
    min-height: 100vh;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }

  input {
    font-family: inherit;
    outline: none;
  }
`;
