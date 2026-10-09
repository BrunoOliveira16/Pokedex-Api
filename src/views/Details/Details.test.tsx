import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { pokeApiService } from '../../models/pokeApi.service';
import { PokemonDetails } from '../../models/pokemon.model';
import { render, screen, waitFor } from '../../test/test-utils';
import { DetailsView } from './index';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockPokemonDetails: PokemonDetails = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  mainType: 'electric',
  photo: 'https://img/pikachu.png',
  height: 0.4,
  weight: 6,
  abilities: ['static', 'lightning-rod'],
  stats: {
    hp: 35,
    atk: 55,
    def: 40,
    satk: 50,
    sdef: 50,
    spd: 90,
  },
  description:
    'When several of these POKéMON gather, their electricity could cause storms.',
  genus: 'Mouse Pokémon',
  genderRate: {
    maleRate: 50,
    femaleRate: 50,
    isGenderless: false,
  },
  captureRate: 190,
  baseHappiness: 70,
  growthRate: 'medium-fast',
  eggGroups: ['field', 'fairy'],
  evolutionChainUrl: 'https://pokeapi.co/api/v2/evolution-chain/10/',
  isLegendary: false,
  isMythical: false,
  evolutionChain: {
    id: 172,
    name: 'pichu',
    photo: 'https://img/pichu.png',
    minLevel: null,
    trigger: null,
    item: null,
    evolvesTo: [
      {
        id: 25,
        name: 'pikachu',
        photo: 'https://img/pikachu.png',
        minLevel: null,
        trigger: 'happiness',
        item: null,
        evolvesTo: [
          {
            id: 26,
            name: 'raichu',
            photo: 'https://img/raichu.png',
            minLevel: null,
            trigger: 'use-item',
            item: 'thunder-stone',
            evolvesTo: [],
          },
        ],
      },
    ],
  },
};

describe('DetailsView component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially while fetching pokemon', () => {
    vi.spyOn(pokeApiService, 'getPokemonDetails').mockImplementation(
      () => new Promise(() => {})
    );

    render(<DetailsView pokemonId={25} />);

    expect(screen.getByText('Carregando detalhes do Pokémon...')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    vi.spyOn(pokeApiService, 'getPokemonDetails').mockRejectedValueOnce(
      new Error('Erro ao carregar Pokémon')
    );

    render(<DetailsView pokemonId={999} />);

    await waitFor(() => {
      expect(
        screen.getByText('Ops! Não conseguimos carregar este Pokémon.')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Erro ao carregar Pokémon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
  });

  it('renders complete pokemon information on successful load', async () => {
    vi.spyOn(pokeApiService, 'getPokemonDetails').mockResolvedValueOnce(
      mockPokemonDetails
    );

    render(<DetailsView pokemonId={25} />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'pikachu' })
      ).toBeInTheDocument();
    });

    expect(screen.getAllByText('#025').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(
      screen.getByText(
        'When several of these POKéMON gather, their electricity could cause storms.'
      )
    ).toBeInTheDocument();

    // Metrics
    expect(screen.getByText('0.4 m')).toBeInTheDocument();
    expect(screen.getByText('6.0 kg')).toBeInTheDocument();
    expect(screen.getByText('Mouse Pokémon')).toBeInTheDocument();
    expect(screen.getByText('♂ 50% / ♀ 50%')).toBeInTheDocument();

    // Abilities
    expect(screen.getByText('static')).toBeInTheDocument();
    expect(screen.getByText('lightning-rod')).toBeInTheDocument();

    // Stats
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('ATK')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();

    // Evolution chain
    expect(screen.getByText('pichu')).toBeInTheDocument();
    expect(screen.getByText('raichu')).toBeInTheDocument();
  });

  it('triggers onBack callback when back button is clicked', async () => {
    const onBackMock = vi.fn();
    const user = userEvent.setup();

    vi.spyOn(pokeApiService, 'getPokemonDetails').mockResolvedValueOnce(
      mockPokemonDetails
    );

    render(<DetailsView pokemonId={25} onBack={onBackMock} />);

    const backButton = screen.getByRole('button', { name: 'Voltar' });
    await user.click(backButton);

    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it('navigates back via router when back button is clicked without onBack prop', async () => {
    const user = userEvent.setup();

    vi.spyOn(pokeApiService, 'getPokemonDetails').mockResolvedValueOnce(
      mockPokemonDetails
    );

    render(<DetailsView pokemonId={25} />);

    const backButton = screen.getByRole('button', { name: 'Voltar' });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
