import styled from 'styled-components';

export const SearchContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0.5rem auto 1rem;
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background-color: #ffffff;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 3px rgba(15, 74, 209, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
  font-weight: 700;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
