import styled from 'styled-components';

interface CardProps {
  $mainType: string;
}

export const CardContainer = styled.li<CardProps>`
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, $mainType }) =>
    theme.colors.types[$mainType] || '#777777'};
  background-image: url('/images/pokeball.svg');
  background-blend-mode: soft-light;
  background-size: 60% 45%;
  background-repeat: no-repeat;
  background-position: top right;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const PokemonImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.25));
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.08);
  }
`;

export const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0 0.5rem;
`;

export const PokemonName = styled.h3`
  font-size: 1.35rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.05rem;
  color: #ffffff;
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.6);
`;

export const PokemonNumber = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

export const TypesRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  backdrop-filter: blur(4px);
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.05rem;
`;

export const InfoValue = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
`;

export const AbilitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

export const AbilitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

export const AbilityTag = styled.span`
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: capitalize;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
`;

export const StatsContainer = styled.div`
  width: calc(100% + 2rem);
  margin: 0.5rem -1rem -0.5rem;
  padding: 0.75rem 1rem;
  background-color: #ffffff;
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.lg};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const StatsTitle = styled.h4<CardProps>`
  margin-bottom: 0.35rem;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
  color: ${({ theme, $mainType }) => theme.colors.types[$mainType] || theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.05rem;
`;
