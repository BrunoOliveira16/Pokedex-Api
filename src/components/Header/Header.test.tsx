import { describe, expect, it } from 'vitest';

import { render, screen } from '../../test/test-utils';
import { Header } from './index';

describe('Header component', () => {
  it('renders PokéAPI logo and badge title', () => {
    render(<Header />);

    const logo = screen.getByRole('img', { name: /pokéapi logo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/pokeapi_256.png');

    expect(screen.getByText(/pokédex react/i)).toBeInTheDocument();
  });
});
