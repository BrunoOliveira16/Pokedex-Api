import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../../test/test-utils';
import { StatBar } from './index';

describe('StatBar component', () => {
  it('renders label and numerical value correctly', () => {
    render(<StatBar label="HP" value={78} />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
  });

  it('renders progress bar with correct aria attributes and percentage width', () => {
    render(<StatBar label="ATK" value={100} max={200} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '200');
  });

  it('applies custom color when customColor prop is provided', () => {
    render(<StatBar label="DEF" value={80} customColor="#123456" />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ backgroundColor: '#123456' });
  });

  it('clamps progress bar to 100% when value exceeds maximum', () => {
    render(<StatBar label="SPD" value={300} max={255} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('clamps progress bar to 0% when value is negative', () => {
    render(<StatBar label="HP" value={-10} max={100} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });
});
