import styled, { css } from 'styled-components';

interface StyledButtonProps {
  $variant: 'primary' | 'secondary' | 'outline' | 'generation';
  $isActive: boolean;
  $fullWidth: boolean;
  $size: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: css`
    padding: 0.35rem 0.75rem;
    font-size: 0.85rem;
  `,
  md: css`
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
  `,
  lg: css`
    padding: 0.75rem 1.75rem;
    font-size: 1.15rem;
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all 0.2s ease-in-out;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  ${({ $size }) => sizeStyles[$size]};

  ${({ $variant, $isActive, theme }) => {
    switch ($variant) {
      case 'generation':
        return $isActive
          ? css`
              background-color: ${theme.colors.primary};
              color: ${theme.colors.secondary};
              border: 2px solid ${theme.colors.secondary};
              box-shadow: 0 4px 10px rgba(15, 74, 209, 0.4);
              transform: translateY(-2px);
            `
          : css`
              background-color: ${theme.colors.secondary};
              color: ${theme.colors.primary};
              border: 2px solid ${theme.colors.primary};
              box-shadow: 2px 3px 5px rgba(15, 74, 209, 0.25);

              &:hover {
                background-color: ${theme.colors.primary};
                color: ${theme.colors.secondary};
                border-color: ${theme.colors.secondary};
                transform: translateY(-2px);
              }
            `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover {
            opacity: 0.9;
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary};
            color: #ffffff;
          }
        `;
      case 'primary':
      default:
        return css`
          background-color: #6c79db;
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 6px rgba(108, 121, 219, 0.3);

          &:hover {
            background-color: #5562c5;
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;
