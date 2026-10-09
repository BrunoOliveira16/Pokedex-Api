import styled, { css } from 'styled-components';

interface EvolutionCardProps {
  $isCurrent?: boolean;
  $isClickable?: boolean;
}

interface ImageWrapperProps {
  $isCurrent?: boolean;
}

export const ChainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem 0;
  width: 100%;
`;

export const EvolutionCard = styled.div<EvolutionCardProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: transform 0.2s ease-in-out;

  ${({ $isClickable }) =>
    $isClickable &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-3px);
      }
    `}
`;

export const PokemonImageWrapper = styled.div<ImageWrapperProps>`
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background-color: ${({ $isCurrent }) =>
    $isCurrent ? 'rgba(15, 74, 209, 0.12)' : '#f8f9fa'};
  border: 2px solid
    ${({ theme, $isCurrent }) => ($isCurrent ? theme.colors.primary : '#e9ecef')};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
`;

export const EvolutionImage = styled.img`
  width: 68px;
  height: 68px;
  object-fit: contain;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
`;

export const PokemonName = styled.span<{ $isCurrent?: boolean }>`
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: capitalize;
  color: ${({ theme, $isCurrent }) =>
    $isCurrent ? theme.colors.primary : theme.colors.text};
`;

export const PokemonId = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ArrowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

export const ArrowIcon = styled.span`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  line-height: 1;
`;

export const TriggerBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  background-color: #e9ecef;
  padding: 0.15rem 0.45rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: capitalize;
`;

export const NoEvolutionMessage = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding: 1.5rem 0;
  width: 100%;
`;
