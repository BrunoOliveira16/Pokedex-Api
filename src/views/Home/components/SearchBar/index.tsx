import React from 'react';

import { ClearButton, SearchContainer, SearchInput } from './styled';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar Pokémon por nome ou número...',
}) => {
  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <ClearButton type="button" onClick={onClear} aria-label="Limpar busca">
          ✕
        </ClearButton>
      )}
    </SearchContainer>
  );
};
