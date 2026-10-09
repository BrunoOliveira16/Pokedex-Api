import React from 'react';

import { LoaderContainer, LoaderText, SpinningPokeball } from './styled';

export interface LoaderProps {
  text?: string;
  size?: number;
}

export const Loader: React.FC<LoaderProps> = ({
  text = 'Carregando Pokémons...',
  size = 48,
}) => {
  return (
    <LoaderContainer>
      <SpinningPokeball src="/images/pokeball.svg" alt="Carregando..." $size={size} />
      {text && <LoaderText>{text}</LoaderText>}
    </LoaderContainer>
  );
};
