# 06 - Layout Estável com 7 Cards por Linha e Transições Suaves entre Gerações

## 1. Contexto & Problema Identificado

Durante a navegação entre gerações através das abas de geração (`GenerationTabs`), foram identificadas duas anomalias de experiência do usuário (UX):

1. **"Piscada Rápida" (Flicker / Desmontagem Abrupta)**:
   - Ao trocar de geração, o estado `isLoading` tornava-se `true` imediatamente.
   - A função `renderContent()` desmontava todo o grid de Pokémon existente e montava temporariamente um `<Loader />` centralizado de altura reduzida.
   - Quando a resposta da PokeAPI chegava (~200ms–400ms depois), o `<Loader />` era desmontado e o novo grid montado, gerando um layout shift vertical agressivo e piscada visual.

2. **Variação Dimensional do Layout ("Tela Diminui ou Aumenta")**:
   - Em gerações com poucos Pokémons (por exemplo, a geração *Hisui / Legends Arceus*, que possui apenas 7 registros), a página não gerava rolagem vertical. No Windows, a ausência da barra de rolagem expandia a viewport em ~17px horizontalmente, causando pulo de layout (*scrollbar shift*).
   - O grid utilizava `repeat(auto-fill, minmax(180px, 1fr))`, o que fazia o número de colunas flutuar entre 6 e 8 conforme a resolução da tela, despadronizando a visualização colecionável.

---

## 2. Solução Implementada

### 2.1 Transição Suave sem Desmontagem do Grid (`HomeView`)

Refatoramos o ciclo de renderização em `src/views/Home/index.tsx`:

- **Diferenciação Semântica de Estados de Carregamento**:
  ```ts
  const isInitialLoading = isLoading && pokemons.length === 0;
  const isChangingGeneration = isLoading && pokemons.length > 0;
  ```
- **Carregamento Inicial (`isInitialLoading`)**:
  - Exibe o `<Loader />` completo de página apenas na primeira carga da aplicação.
- **Troca de Geração (`isChangingGeneration`)**:
  - Mantém o grid anterior montado em tela com opacidade atenuada (`opacity: 0.45`, `pointer-events: none`).
  - Renderiza uma pílula informativa flutuante com micro-spinner (`<TransitionIndicator>` + `<SpinnerSmall>`), comunicando ao usuário que a nova geração está sendo carregada sem desmontar a página.
  - Ao concluir a requisição, o grid é atualizado suavemente e a opacidade retorna a 100% via transição CSS (`transition: opacity 0.25s ease-in-out`).

```tsx
const renderPokemonGrid = () => (
  <GridContainer>
    {isChangingGeneration && (
      <TransitionIndicator role="status" aria-live="polite">
        <SpinnerSmall />
        <span>Carregando {selectedGen.label}...</span>
      </TransitionIndicator>
    )}

    <PokemonGrid $isTransitioning={isChangingGeneration}>
      {filteredPokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onSelectPokemon={onSelectPokemon}
        />
      ))}
    </PokemonGrid>

    {hasMore && (
      <PaginationWrapper>
        <Button
          variant="primary"
          size="lg"
          onClick={handleLoadMore}
          disabled={isLoadingMore || isChangingGeneration}
        >
          {isLoadingMore ? 'Carregando mais...' : 'Carregar Mais'}
        </Button>
      </PaginationWrapper>
    )}
  </GridContainer>
);
```

---

### 2.2 Estabilização Visual da Viewport e Altura Mínima

Para eliminar a flutuação de tamanho entre gerações com muitas e poucas linhas:

1. **Eliminação do Salto da Barra de Rolagem (`src/styles/global.ts`)**:
   ```css
   html {
     scrollbar-gutter: stable;
     overflow-y: scroll;
   }
   ```
   Garante que o gutter da barra de rolagem esteja permanentemente reservado em navegadores modernos, impedindo o layout de variar 17px horizontalmente.

2. **Ampliação da Área Central em Branco**:
   ```css
   body {
     width: 100%;
     max-width: 1560px;
     min-width: 360px;
     margin: 0 auto;
     background-color: ${({ theme }) => theme.colors.background};
     min-height: 100vh;
     box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
   }
   ```
   Aumentou a largura máxima de 1440px para 1560px, fornecendo espaço ideal para cards colecionáveis de ~200px.

3. **Ancoragem de Altura Mínima**:
   - `MainContent`: `min-height: calc(100vh - 100px);` evita colapso vertical do container branco.
   - `GridContainer`: `min-height: 520px; position: relative;` garante altura padrão mesmo quando uma geração possui apenas 1 linha de cards.

---

### 2.3 Grid Desktop Rigorosamente Fixo em 7 Cards por Linha

No arquivo `src/views/Home/styled.ts`:

```ts
export const PokemonGrid = styled.ul<PokemonGridProps>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  padding: 1rem 0;
  margin: 0;
  list-style: none;
  opacity: ${({ $isTransitioning }) => ($isTransitioning ? 0.45 : 1)};
  transition: opacity 0.25s ease-in-out;
  pointer-events: ${({ $isTransitioning }) => ($isTransitioning ? 'none' : 'auto')};

  @media screen and (min-width: 580px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 820px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (min-width: 1040px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media screen and (min-width: 1280px) {
    grid-template-columns: repeat(7, 1fr);
    gap: 1rem;
  }
`;
```

#### Alinhamento Matemático com a Paginação:
- **Tamanho do Lote (`BATCH_SIZE`)**: 35 Pokémon.
- **Colunas por Linha**: 7 colunas no breakpoint desktop (`min-width: 1280px`).
- **Linhas Exatas por Lote**: $\frac{35}{7} = 5$ linhas completas por carregamento.
- **Caso Especial (Hisui / Arceus)**: 7 registros ocupam com precisão cirúrgica a 1ª linha completa de 7 cards, mantendo a mesma largura proporcional e sem distorcer o tamanho dos cards.

---

## 3. Cobertura de Testes Automatizados

No arquivo `src/views/Home/Home.test.tsx`:
- Adicionado teste de integração que valida a retenção do grid na tela enquanto a nova geração é requisitada assincronamente:
  * O Pokémon da geração anterior (`bulbasaur`) permanece visível.
  * O indicador de status `Carregando 2ª Geração...` é exibido em conformidade com acessibilidade (`role="status"`, `aria-live="polite"`).
  * Ao resolver a Promise da nova geração, o novo Pokémon (`chikorita`) passa a ser exibido e o indicador é removido.
