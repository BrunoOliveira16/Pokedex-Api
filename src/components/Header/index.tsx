import { HeaderContainer, Logo, TitleBadge } from './styled';

export const Header = () => {
  return (
    <HeaderContainer>
      <Logo src="/images/pokeapi_256.png" alt="PokéAPI Logo" />
      <TitleBadge>Pokédex React</TitleBadge>
    </HeaderContainer>
  );
};
