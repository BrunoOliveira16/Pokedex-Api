import styled from 'styled-components';

interface StyledBadgeProps {
  $type: string;
}

export const StyledBadge = styled.div<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, $type }) =>
    theme.colors.types[$type]?.badge || '#777777'};
  color: ${({ theme, $type }) => theme.colors.types[$type]?.icon || '#000000'};
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.05rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  filter: contrast(1.05);
`;

export const TypeIcon = styled.span<StyledBadgeProps>`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  background-color: ${({ theme, $type }) => theme.colors.types[$type]?.icon || '#000000'};
  mask-image: url(${({ $type }) => `/images/${$type}.svg`});
  -webkit-mask-image: url(${({ $type }) => `/images/${$type}.svg`});
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
  flex-shrink: 0;
`;

export const BadgeIcon = TypeIcon;
