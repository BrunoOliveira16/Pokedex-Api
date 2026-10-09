import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Pokemon } from '../../../../models/pokemon.model';
import { render, screen } from '../../../../test/test-utils';
import { PokemonCard } from './index';

const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  mainType: 'electric',
  photo:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  height: 0.4,
  weight: 6.0,
  abilities: ['static', 'lightning-rod'],
  stats: {
    hp: 35,
    atk: 55,
    def: 40,
    satk: 50,
    sdef: 50,
    spd: 90,
  },
};

describe('PokemonCard component', () => {
  it('renders pokemon name, formatted id and type badges', () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  it('renders official artwork image and handles load error fallback', () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const image = screen.getByRole('img', { name: 'pikachu' });
    expect(image).toHaveAttribute('src', mockPokemon.photo);

    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/images/pokeball.svg');
  });

  it('triggers onSelectPokemon when clicked', () => {
    const handleSelect = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onSelectPokemon={handleSelect} />);

    const card = screen.getByRole('button', { name: /ver detalhes de pikachu/i });
    fireEvent.click(card);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(25);
  });

  it('triggers onSelectPokemon on Enter and Space key presses', () => {
    const handleSelect = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onSelectPokemon={handleSelect} />);

    const card = screen.getByRole('button', { name: /ver detalhes de pikachu/i });

    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith(25);

    fireEvent.keyDown(card, { key: ' ' });
    expect(handleSelect).toHaveBeenCalledWith(25);

    expect(handleSelect).toHaveBeenCalledTimes(2);
  });

  it('renders cleanly without interactive button role when onSelectPokemon is not provided', () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
