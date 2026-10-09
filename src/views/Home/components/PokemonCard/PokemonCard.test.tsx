import { fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Pokemon } from '../../../../models/pokemon.model';
import { render, screen } from '../../../../test/test-utils';
import { PokemonCard } from './index';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('navigates to /pokemon/:id by default when clicked', () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const card = screen.getByRole('button', { name: /ver detalhes de pikachu/i });
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/25');
  });

  it('navigates to /pokemon/:id on Enter and Space keys by default', () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const card = screen.getByRole('button', { name: /ver detalhes de pikachu/i });

    fireEvent.keyDown(card, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/25');

    fireEvent.keyDown(card, { key: ' ' });
    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/25');

    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });

  it('triggers custom onSelectPokemon callback if provided instead of navigating', () => {
    const handleSelect = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onSelectPokemon={handleSelect} />);

    const card = screen.getByRole('button', { name: /ver detalhes de pikachu/i });
    fireEvent.click(card);

    expect(handleSelect).toHaveBeenCalledWith(25);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
