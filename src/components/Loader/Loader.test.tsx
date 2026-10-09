import { describe, expect, it } from 'vitest';

import { render, screen } from '../../test/test-utils';
import { Loader } from './index';

describe('Loader component', () => {
  it('renders default loading text', () => {
    render(<Loader />);

    expect(screen.getByText('Carregando Pokémons...')).toBeInTheDocument();
  });

  it('renders custom loading text', () => {
    render(<Loader text="Buscando geração 1..." />);

    expect(screen.getByText('Buscando geração 1...')).toBeInTheDocument();
  });

  it('renders pokeball image icon', () => {
    render(<Loader />);

    const img = screen.getByRole('img', { name: /carregando/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/pokeball.svg');
  });
});
