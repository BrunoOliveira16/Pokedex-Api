import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '../../../../test/test-utils';
import { SearchBar } from './index';

describe('SearchBar component', () => {
  it('renders input with placeholder', () => {
    render(
      <SearchBar
        value=""
        onChange={vi.fn()}
        onClear={vi.fn()}
        placeholder="Buscar Pokémon..."
      />
    );
    expect(screen.getByPlaceholderText('Buscar Pokémon...')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar value="" onChange={handleChange} onClear={vi.fn()} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Pikachu');

    expect(handleChange).toHaveBeenCalled();
  });

  it('shows clear button when there is a value and calls onClear on click', async () => {
    const handleClear = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar value="Charmander" onChange={vi.fn()} onClear={handleClear} />);

    const clearButton = screen.getByRole('button', { name: /limpar busca/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
