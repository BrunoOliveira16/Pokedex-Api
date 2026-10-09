import React from 'react';

import {
  BarBackground,
  BarFill,
  BarWrapper,
  Container,
  StatLabel,
  StatValue,
} from './styled';

export interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  colorType?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max = 252,
  colorType = 'normal',
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <Container>
      <StatLabel $colorType={colorType}>{label.toUpperCase()}</StatLabel>
      <BarWrapper>
        <BarBackground>
          <BarFill $colorType={colorType} $width={percentage} />
        </BarBackground>
      </BarWrapper>
      <StatValue $colorType={colorType}>{value}</StatValue>
    </Container>
  );
};
