import React from 'react';

import { StyledButton } from './styled';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'generation';
  isActive?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  isActive = false,
  fullWidth = false,
  size = 'md',
  children,
  ...rest
}: ButtonProps) => {
  return (
    <StyledButton
      $variant={variant}
      $isActive={isActive}
      $fullWidth={fullWidth}
      $size={size}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};
