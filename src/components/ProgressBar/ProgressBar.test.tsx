import { describe, expect, it } from 'vitest';

import { render, screen } from '../../test/test-utils';
import { ProgressBar } from './index';

describe('ProgressBar component', () => {
  it('renders stat label and numeric value', () => {
    render(<ProgressBar label="hp" value={45} colorType="grass" />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('renders correctly with default max 252', () => {
    render(<ProgressBar label="atk" value={100} colorType="fire" />);

    expect(screen.getByText('ATK')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
