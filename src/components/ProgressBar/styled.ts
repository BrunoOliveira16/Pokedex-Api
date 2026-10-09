import styled from 'styled-components';

interface TypeColorProps {
  $colorType: string;
}

interface BarFillProps extends TypeColorProps {
  $width: number;
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  margin: 0.2rem 0;
`;

export const StatLabel = styled.span<TypeColorProps>`
  width: 45px;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: right;
  color: ${({ theme, $colorType }) =>
    theme.colors.types[$colorType]?.icon || theme.colors.text};
`;

export const BarWrapper = styled.div`
  flex: 1;
`;

export const BarBackground = styled.div`
  width: 100%;
  height: 0.85rem;
  background-color: #eeeeee;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const BarFill = styled.div<BarFillProps>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background-color: ${({ theme, $colorType }) =>
    theme.colors.types[$colorType]?.badge || theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const StatValue = styled.span<TypeColorProps>`
  width: 35px;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: left;
  color: ${({ theme, $colorType }) =>
    theme.colors.types[$colorType]?.icon || theme.colors.text};
`;
