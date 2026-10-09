import styled from 'styled-components';

interface DetailsContainerProps {
  $mainType?: string;
}

export const DetailsContainer = styled.div<DetailsContainerProps>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme, $mainType }) =>
    $mainType
      ? theme.colors.types[$mainType] || theme.colors.primary
      : theme.colors.background};
  transition: background-color 0.3s ease-in-out;
  position: relative;
`;

export const TopNav = styled.nav`
  width: 100%;
  padding: 1.25rem 1.5rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BackButton = styled.button`
  background: transparent;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(-2px);
  }
`;

export const HeaderInfo = styled.div`
  padding: 0.5rem 1.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const NameGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const PokemonTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: #ffffff;
  text-transform: capitalize;
  letter-spacing: 0.05rem;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
`;

export const PokemonNumber = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
`;

export const TypesRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const HeroSection = styled.div`
  width: 100%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: -2.5rem;
  z-index: 2;
`;

export const HeroImage = styled.img`
  max-height: 100%;
  max-width: 260px;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

export const DetailsCard = styled.main`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-top-left-radius: 2.25rem;
  border-top-right-radius: 2.25rem;
  padding: 3.5rem 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
  width: 100%;
`;

export const SectionBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 2px solid #f1f3f5;
  padding-bottom: 0.35rem;
`;

export const DescriptionText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  font-style: italic;
  text-align: center;
  background-color: #f8f9fa;
  padding: 0.85rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
  background-color: #f8f9fa;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1rem;

  @media screen and (min-width: 600px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

export const MetricLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.04rem;
`;

export const MetricValue = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

export const AbilitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const AbilityBadge = styled.span`
  background-color: #e9ecef;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-transform: capitalize;
`;

export const StatusMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 3rem 1.5rem;
  gap: 1.25rem;
  text-align: center;
`;

export const StatusTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const StatusDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 420px;
`;
