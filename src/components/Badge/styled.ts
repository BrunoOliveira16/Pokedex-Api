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
  background-color: ${({ theme, $type }) => theme.colors.types[$type] || '#777777'};
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.05rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  filter: contrast(1.1);
`;

export const BadgeIcon = styled.img`
  width: 14px;
  height: 14px;
  object-fit: contain;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4));
`;
