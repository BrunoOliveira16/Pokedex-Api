# 07 - Acabamento Visual na DetailsView (Sheet Overlap) & Sprites de Itens de Evolução

## 1. Contexto & Objetivos

Para elevar a experiência visual e a precisão das informações na tela de detalhes (`DetailsView`), foram implementadas duas melhorias fundamentais:

1. **Efeito Visual "Sheet Overlap"**:
   - Transição suave entre o cabeçalho colorido dinâmico (baseado no tipo primário do Pokémon) e o corpo de conteúdo branco com cantos arredondados expressivos, criando uma sobreposição elegante estilo bottom-sheet mobile moderno.
   - O sprite principal do Pokémon no `HeroSection` agora repousa sobre a junção, projetando sombra suave sobre a folha de detalhes sem oclusão de elementos.

2. **Renderização Oficial de Sprites de Itens de Evolução (`EvolutionChain`)**:
   - Identificação de gatilhos evolutivos disparados por itens (como `thunder-stone`, `water-stone`, `fire-stone`, etc.).
   - Consumo dinâmico dos sprites oficiais da CDN da PokéAPI:
     `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`
   - Renderização acessível com `alt` contextual, tooltip nativo (`title`) e legenda estilizada com nome formatado do item.

---

## 2. Padrão Visual "Sheet Overlap" (`src/views/Details/styled.ts`)

### 2.1 Estrutura em Camadas (Z-Index e Margens Negativas)

- **`HeroSection`**:
  - `height: 240px;` (200px em telas pequenas).
  - `position: relative; z-index: 3;` para manter o sprite oficial flutuando no topo do layout.
- **`DetailsCard`**:
  - `margin-top: -2.5rem;` (-2rem no mobile), puxando o container branco para sobrepor suavemente o final do cabeçalho colorido.
  - `position: relative; z-index: 2;` para criar a camada intermediária entre o fundo e a arte principal.
  - `border-top-left-radius: 2rem; border-top-right-radius: 2rem;` para o formato arredondado de sheet.
  - `box-shadow: ${({ theme }) => theme.shadows.lg};` para profundidade e relevo estético consistente com o design system.
  - `padding: 3.5rem 1.5rem 3rem;` reservando espaço superior para que o conteúdo interno não colida com o Pokémon sobreposto.

```ts
export const DetailsCard = styled.main`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  margin-top: -2.5rem;
  position: relative;
  z-index: 2;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  padding: 3.5rem 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;

  @media screen and (max-width: 480px) {
    margin-top: -2rem;
    padding: 3rem 1rem 2.5rem;
    border-top-left-radius: 1.75rem;
    border-top-right-radius: 1.75rem;
    gap: 1.25rem;
  }
`;
```

---

## 3. Renderização de Sprites de Itens na Cadeia Evolutiva (`EvolutionChain`)

### 3.1 Arquitetura do Componente (`src/views/Details/components/EvolutionChain/index.tsx`)

Ao iterar pelos nós evolutivos (`EvolutionNode`), o componente inspeciona se a transição entre estágios exige um item:

```tsx
{node.item && (
  <ItemContainer title={formatItemName(node.item)}>
    <ItemSprite
      src={getItemSpriteUrl(node.item)}
      alt={`Item: ${formatItemName(node.item)}`}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  </ItemContainer>
)}
<ArrowIcon aria-hidden="true">➔</ArrowIcon>
{triggerLabel && <TriggerBadge>{triggerLabel}</TriggerBadge>}
```

### 3.2 Estilização e Acessibilidade (`src/views/Details/components/EvolutionChain/styled.ts`)

- **`ItemContainer`**: Micro-container centralizado com bordas suaves (`border-radius: md`), sombra sutil e transição em hover (`transform: scale(1.1)`).
- **`ItemSprite`**: Dimensão contida de `1.5rem` com `object-fit: contain` e filtro de sombra para destacar o item sobre fundos claros.
- **Acessibilidade**:
  - `alt`: `Item: ${formatItemName(node.item)}` garantindo leitura por leitores de tela.
  - `title`: Tooltip nativo acessível com o nome formatado.
  - `TriggerBadge`: Legenda complementar textual visível para todos os usuários.
  - `onError`: Tratamento resiliente que oculta a imagem caso a URL externa esteja indisponível.

---

## 4. Cobertura de Testes Automatizados

No arquivo `src/views/Details/components/EvolutionChain/EvolutionChain.test.tsx` (8 testes):
1. Validação de mensagens de fallback para Pokémons sem evolução ou de estágio único.
2. Renderização completa de nomes e números formatados com preenchimento de zeros (`#025`).
3. Renderização de sprites oficiais de itens com URL da CDN e atributos acessíveis (`alt`, `title`).
4. Renderização correta de gatilhos de nível (`Nv. 16`, `Nv. 32`).
5. Suporte a interações e disparo de callbacks de seleção (`onSelectPokemon`).
