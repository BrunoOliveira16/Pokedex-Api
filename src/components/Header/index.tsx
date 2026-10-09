import React from 'react';

import { HeaderContainer, Logo, TitleBadge } from './styled';

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo src="/images/pokeapi_256.png" alt="PokéAPI Logo" />
      <TitleBadge>Pokédex React</TitleBadge>
    </HeaderContainer>
  );
};
