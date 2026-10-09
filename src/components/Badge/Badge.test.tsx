import { describe, expect, it } from 'vitest';

import { render, screen } from '../../test/test-utils';
import { Badge } from './index';

describe('Badge component', () => {
  it('renders pokemon type label', () => {
    render(<Badge type="fire" />);
    expect(screen.getByText('fire')).toBeInTheDocument();
  });

  it('renders type icon with role img and aria-label by default', () => {
    render(<Badge type="electric" />);
    const icon = screen.getByRole('img', { name: 'electric' });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-label', 'electric');
  });

  it('does not render icon when showIcon is false', () => {
    render(<Badge type="water" showIcon={false} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('water')).toBeInTheDocument();
  });

  it('handles mixed-case type names gracefully', () => {
    render(<Badge type="Grass" />);
    expect(screen.getByText('Grass')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Grass' })).toBeInTheDocument();
  });
});
