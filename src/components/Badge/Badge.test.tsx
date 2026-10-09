import { describe, expect, it } from 'vitest';

import { render, screen } from '../../test/test-utils';
import { Badge } from './index';

describe('Badge component', () => {
  it('renders pokemon type label', () => {
    render(<Badge type="fire" />);
    expect(screen.getByText('fire')).toBeInTheDocument();
  });

  it('renders type icon with expected src by default', () => {
    render(<Badge type="electric" />);
    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/images/electric.svg');
    expect(icon).toHaveAttribute('alt', 'electric');
  });

  it('does not render icon when showIcon is false', () => {
    render(<Badge type="water" showIcon={false} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('water')).toBeInTheDocument();
  });
});
