import styled from 'styled-components';

interface CardContainerProps {
  $mainType: string;
  $isClickable?: boolean;
}

export const CardContainer = styled.li<CardContainerProps>`
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.875rem 0.875rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, $mainType }) =>
    theme.colors.types[$mainType]?.bg || '#777777'};
  background-image: url('/images/pokeball.svg');
  background-blend-mode: soft-light;
  background-size: 75% 75%;
  background-repeat: no-repeat;
  background-position: right -15px bottom -15px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
  outline: none;
  position: relative;
  overflow: hidden;

  &:hover {
    ${({ $isClickable, theme }) =>
      $isClickable &&
      `
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.lg};
    `}
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
`;

export const PokemonName = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.02rem;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PokemonNumber = styled.span`
  font-size: 0.85rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  margin-left: 0.5rem;
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 0.5rem;
`;

export const PokemonImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
  transition: transform 0.2s ease-in-out;

  ${CardContainer}:hover & {
    transform: scale(1.08);
  }
`;

export const TypesRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.35rem;
  flex-wrap: wrap;
  align-items: center;
`;
