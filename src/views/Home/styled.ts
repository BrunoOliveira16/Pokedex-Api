import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 1.5rem 1rem 3rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 100px);
`;

export const GridContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 520px;
  position: relative;
`;

interface PokemonGridProps {
  $isTransitioning?: boolean;
}

export const PokemonGrid = styled.ul<PokemonGridProps>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  padding: 1rem 0;
  margin: 0;
  list-style: none;
  opacity: ${({ $isTransitioning }) => ($isTransitioning ? 0.45 : 1)};
  transition: opacity 0.25s ease-in-out;
  pointer-events: ${({ $isTransitioning }) => ($isTransitioning ? 'none' : 'auto')};

  @media screen and (min-width: 580px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 820px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (min-width: 1040px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media screen and (min-width: 1280px) {
    grid-template-columns: repeat(7, 1fr);
    gap: 1rem;
  }
`;

export const TransitionIndicator = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  box-shadow: ${({ theme }) => theme.shadows.md};
  font-size: 0.875rem;
  font-weight: 600;
  pointer-events: none;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -8px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

export const SpinnerSmall = styled.span`
  width: 1rem;
  height: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 1rem 1rem;
`;

export const StatusMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
  text-align: center;
`;

export const StatusTitle = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const StatusDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 400px;
`;
