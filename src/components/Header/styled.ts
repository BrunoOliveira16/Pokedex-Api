import styled from 'styled-components';

export const HeaderContainer = styled.header`
  width: 100%;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #afeeee 0%, #76d7ea 100%);
  border-bottom: 3px solid rgba(15, 74, 209, 0.2);
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const Logo = styled.img`
  height: 52px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

export const TitleBadge = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 0.2rem 0.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;
