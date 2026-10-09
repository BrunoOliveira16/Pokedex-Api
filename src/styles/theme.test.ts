import { describe, expect, it } from 'vitest';

import { theme } from './theme';

const EXPECTED_POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

describe('Theme Design System - 3-Tone Type Colors', () => {
  it('defines all 18 Pokémon types in theme.colors.types', () => {
    EXPECTED_POKEMON_TYPES.forEach((type) => {
      expect(theme.colors.types).toHaveProperty(type);
    });
    expect(Object.keys(theme.colors.types)).toHaveLength(18);
  });

  it('ensures each type has valid bg, badge and icon 6-digit hex color tokens', () => {
    EXPECTED_POKEMON_TYPES.forEach((type) => {
      const tokens = theme.colors.types[type];
      expect(tokens).toBeDefined();

      expect(tokens.bg).toMatch(HEX_COLOR_REGEX);
      expect(tokens.badge).toMatch(HEX_COLOR_REGEX);
      expect(tokens.icon).toMatch(HEX_COLOR_REGEX);
    });
  });

  it('ensures bg, badge and icon tokens are distinct tones for each type', () => {
    EXPECTED_POKEMON_TYPES.forEach((type) => {
      const tokens = theme.colors.types[type];
      expect(tokens.bg).not.toBe(tokens.badge);
      expect(tokens.badge).not.toBe(tokens.icon);
      expect(tokens.bg).not.toBe(tokens.icon);
    });
  });
});
