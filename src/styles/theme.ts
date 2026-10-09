export const theme = {
  colors: {
    primary: '#0f4ad1',
    secondary: '#f7cf2e',
    background: '#F6F8FC',
    cardBackground: '#FFFFFF',
    text: '#2c3e50',
    textLight: '#FFFFFF',
    textMuted: '#6c757d',
    border: '#e1e4e8',
    headerBg: '#afeeee',

    // Pokémon Type Colors
    types: {
      normal: '#a6a877',
      grass: '#77c850',
      fire: '#ee7f30',
      water: '#678fee',
      electric: '#f7cf2e',
      ice: '#98d5d7',
      ground: '#997d31',
      flying: '#a98ff0',
      poison: '#a040a0',
      fighting: '#bf3029',
      psychic: '#f65687',
      rock: '#b8a137',
      bug: '#a8b720',
      ghost: '#6e5896',
      dragon: '#6f38f6',
      dark: '#725847',
      steel: '#b9b7cf',
      fairy: '#f9aec7',
    } as Record<string, string>,

    stats: {
      hp: '#FF5959',
      atk: '#F5AC78',
      def: '#FAE078',
      satk: '#9DB7F5',
      sdef: '#A7DB8D',
      spd: '#FA92B2',
    },
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    button: '2px 3px 5px rgba(15, 74, 209, 0.4)',
  },
};

export type ThemeType = typeof theme;
