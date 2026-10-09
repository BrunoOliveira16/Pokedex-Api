export interface TypeColorTokens {
  bg: string;
  badge: string;
  icon: string;
}

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

    // Pokémon Type Colors (3-tone hierarchical palette: bg, badge, icon)
    types: {
      normal: {
        bg: '#C6C6A7',
        badge: '#9DA07D',
        icon: '#6D6D4E',
      },
      fire: {
        bg: '#F5AC78',
        badge: '#F08030',
        icon: '#AB4E13',
      },
      water: {
        bg: '#9DB7F5',
        badge: '#6890F0',
        icon: '#385DC5',
      },
      grass: {
        bg: '#A7DB8D',
        badge: '#78C850',
        icon: '#4E8234',
      },
      electric: {
        bg: '#FAEC92',
        badge: '#F8D030',
        icon: '#A1871F',
      },
      ice: {
        bg: '#BCE6E6',
        badge: '#98D8D8',
        icon: '#4A9999',
      },
      fighting: {
        bg: '#DE837E',
        badge: '#C03028',
        icon: '#7D1F1A',
      },
      poison: {
        bg: '#C183C1',
        badge: '#A040A0',
        icon: '#682A68',
      },
      ground: {
        bg: '#EAD699',
        badge: '#D4A82F',
        icon: '#8E6F18',
      },
      flying: {
        bg: '#C6B7F5',
        badge: '#A890F0',
        icon: '#6D52C7',
      },
      psychic: {
        bg: '#FA92B2',
        badge: '#F85888',
        icon: '#A13959',
      },
      bug: {
        bg: '#C6D16E',
        badge: '#A8B820',
        icon: '#6D7815',
      },
      rock: {
        bg: '#D1C17D',
        badge: '#B8A038',
        icon: '#786824',
      },
      ghost: {
        bg: '#A292BC',
        badge: '#705898',
        icon: '#493963',
      },
      dragon: {
        bg: '#A27DFA',
        badge: '#7038F8',
        icon: '#441F9C',
      },
      steel: {
        bg: '#D1D1E0',
        badge: '#B8B8D0',
        icon: '#70708C',
      },
      fairy: {
        bg: '#F4BDC9',
        badge: '#EE99AC',
        icon: '#9B485A',
      },
      dark: {
        bg: '#A99A91',
        badge: '#705848',
        icon: '#49392F',
      },
    } as Record<string, TypeColorTokens>,

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
