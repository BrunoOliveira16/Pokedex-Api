import styled from 'styled-components';

interface BarFillProps {
  $progress: number;
  $statColor: string;
}

export const StatBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.75rem;
  margin: 0.35rem 0;
`;

export const StatLabel = styled.span`
  width: 55px;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: right;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.04rem;
`;

export const StatValue = styled.span`
  width: 36px;
  font-size: 0.9rem;
  font-weight: 700;
  text-align: right;
  color: ${({ theme }) => theme.colors.text};
`;

export const Track = styled.div`
  flex: 1;
  height: 0.75rem;
  background-color: #e9ecef;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
`;

export const BarFill = styled.div<BarFillProps>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background-color: ${({ $statColor }) => $statColor};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;
