import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '../../test/test-utils';
import { Button } from './index';

describe('Button component', () => {
  it('renders children correctly', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
  });

  it('triggers onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Enviar</Button>);

    const button = screen.getByRole('button', { name: /enviar/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Desabilitado</Button>);
    const button = screen.getByRole('button', { name: /desabilitado/i });
    expect(button).toBeDisabled();
  });

  it('renders generation variant with active state', () => {
    render(
      <Button variant="generation" isActive>
        1ª Geração
      </Button>
    );
    const button = screen.getByRole('button', { name: /1ª geração/i });
    expect(button).toBeInTheDocument();
  });
});
