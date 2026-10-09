import { useTheme } from 'styled-components';

import { BarFill, StatBarContainer, StatLabel, StatValue, Track } from './styled';

export interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  statName?: 'hp' | 'atk' | 'def' | 'satk' | 'sdef' | 'spd' | string;
  customColor?: string;
  className?: string;
}

export const StatBar = ({
  label,
  value,
  max = 255,
  statName,
  customColor,
  className,
}: StatBarProps) => {
  const theme = useTheme();

  const progress = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const resolvedColor =
    customColor ||
    (statName &&
      theme.colors.stats[statName.toLowerCase() as keyof typeof theme.colors.stats]) ||
    theme.colors.primary;

  return (
    <StatBarContainer className={className}>
      <StatLabel>{label}</StatLabel>
      <StatValue>{value}</StatValue>
      <Track>
        <BarFill
          $progress={progress}
          $statColor={resolvedColor}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </Track>
    </StatBarContainer>
  );
};
