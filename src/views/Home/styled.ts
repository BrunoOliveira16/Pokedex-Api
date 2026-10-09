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
`;

export const PokemonGrid = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1rem 0;
  margin: 0;

  @media screen and (min-width: 580px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 960px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
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
