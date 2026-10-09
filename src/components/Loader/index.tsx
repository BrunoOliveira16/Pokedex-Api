import { LoaderContainer, LoaderText, SpinningPokeball } from './styled';

export interface LoaderProps {
  text?: string;
  size?: number;
}

export const Loader = ({
  text = 'Carregando Pokémons...',
  size = 48,
}: LoaderProps) => {
  return (
    <LoaderContainer>
      <SpinningPokeball src="/images/pokeball.svg" alt="Carregando..." $size={size} />
      {text && <LoaderText>{text}</LoaderText>}
    </LoaderContainer>
  );
};
