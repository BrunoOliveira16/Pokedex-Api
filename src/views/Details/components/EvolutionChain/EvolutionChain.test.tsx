import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EvolutionNode } from '../../../../models/pokemon.model';
import { render, screen } from '../../../../test/test-utils';
import { EvolutionChain } from './index';

const mockEvolutions: EvolutionNode[] = [
  {
    id: 172,
    name: 'pichu',
    photo: 'https://img/pichu.png',
    minLevel: null,
    trigger: null,
    item: null,
    evolvesTo: [],
  },
  {
    id: 25,
    name: 'pikachu',
    photo: 'https://img/pikachu.png',
    minLevel: null,
    trigger: 'happiness',
    item: null,
    evolvesTo: [],
  },
  {
    id: 26,
    name: 'raichu',
    photo: 'https://img/raichu.png',
    minLevel: null,
    trigger: 'use-item',
    item: 'thunder-stone',
    evolvesTo: [],
  },
];

const mockEvolutionTree: EvolutionNode = {
  id: 1,
  name: 'bulbasaur',
  photo: 'https://img/bulbasaur.png',
  minLevel: null,
  trigger: null,
  item: null,
  evolvesTo: [
    {
      id: 2,
      name: 'ivysaur',
      photo: 'https://img/ivysaur.png',
      minLevel: 16,
      trigger: 'level-up',
      item: null,
      evolvesTo: [
        {
          id: 3,
          name: 'venusaur',
          photo: 'https://img/venusaur.png',
          minLevel: 32,
          trigger: 'level-up',
          item: null,
          evolvesTo: [],
        },
      ],
    },
  ],
};

describe('EvolutionChain component', () => {
  it('renders fallback message when pokemon has no evolutions', () => {
    render(<EvolutionChain evolutions={[]} />);

    expect(screen.getByText('Este Pokémon não possui evoluções.')).toBeInTheDocument();
  });

  it('renders fallback message when only a single stage exists without evolutions', () => {
    const singleNode: EvolutionNode = {
      id: 132,
      name: 'ditto',
      photo: 'https://img/ditto.png',
      minLevel: null,
      trigger: null,
      item: null,
      evolvesTo: [],
    };

    render(<EvolutionChain evolutions={[singleNode]} />);

    expect(screen.getByText('Este Pokémon não possui evoluções.')).toBeInTheDocument();
  });

  it('renders full sequence of evolutions with names and formatted IDs', () => {
    render(<EvolutionChain evolutions={mockEvolutions} currentPokemonId={25} />);

    expect(screen.getByText('pichu')).toBeInTheDocument();
    expect(screen.getByText('#172')).toBeInTheDocument();

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('#025')).toBeInTheDocument();

    expect(screen.getByText('raichu')).toBeInTheDocument();
    expect(screen.getByText('#026')).toBeInTheDocument();
  });

  it('renders triggers like item and custom conditions', () => {
    render(<EvolutionChain evolutions={mockEvolutions} />);

    expect(screen.getByText('happiness')).toBeInTheDocument();
    expect(screen.getByText('thunder stone')).toBeInTheDocument();
  });

  it('flattens and renders hierarchical evolution tree via chain prop with level triggers', () => {
    render(<EvolutionChain chain={mockEvolutionTree} />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    expect(screen.getByText('venusaur')).toBeInTheDocument();

    expect(screen.getByText('Nv. 16')).toBeInTheDocument();
    expect(screen.getByText('Nv. 32')).toBeInTheDocument();
  });

  it('triggers onSelectPokemon callback when clicking on an evolution item', async () => {
    const onSelectMock = vi.fn();
    const user = userEvent.setup();

    render(<EvolutionChain evolutions={mockEvolutions} onSelectPokemon={onSelectMock} />);

    const pikachuCard = screen.getByText('pikachu').closest('div');
    expect(pikachuCard).not.toBeNull();
    if (pikachuCard) {
      await user.click(pikachuCard);
      expect(onSelectMock).toHaveBeenCalledWith(25);
    }
  });
});
