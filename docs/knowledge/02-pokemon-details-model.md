# 02 - Camada de Dados: Modelos e Serviços para Detalhes e Cadeia de Evolução

## 1. Objetivo & Motivação

Como parte do desenvolvimento da tela de detalhes do Pokémon (`feat/pokemon-details-view`), surgiu a necessidade de expandir a camada de domínio para além dos dados básicos do card. Os novos requisitos incluem:

- Apresentação de descrição oficial (_flavor text_) e categoria (_genus_).
- Métricas avançadas: taxas de gênero (macho/fêmea), taxa de captura, felicidade base e grupo de ovos.
- Cadeia de evolução visual e hierárquica (estágios 1, 2 e 3, níveis e itens necessários).

---

## 2. Modelos e Contratos de Domínio (`src/models/pokemon.model.ts`)

### 2.1 Principais Interfaces Criadas

- **`PokemonDetails` (estende `Pokemon`)**:
  Adiciona atributos de espécie e a árvore evolutiva sem quebrar compatibilidade com componentes que já consomem `Pokemon`.

  ```ts
  export interface PokemonDetails extends Pokemon {
    description: string;
    genus: string;
    genderRate: PokemonGenderRate;
    captureRate: number;
    baseHappiness: number;
    growthRate: string;
    eggGroups: string[];
    evolutionChainUrl: string;
    isLegendary: boolean;
    isMythical: boolean;
    evolutionChain?: EvolutionNode;
  }
  ```

- **`EvolutionNode`**:
  Estrutura em árvore que representa a hierarquia evolutiva:

  ```ts
  export interface EvolutionNode {
    id: number;
    name: string;
    photo: string;
    minLevel: number | null;
    trigger: string | null;
    item: string | null;
    evolvesTo: EvolutionNode[];
  }
  ```

- **Tipos Auxiliares**:
  - `PokemonGenderRate`: Representa `maleRate`, `femaleRate` e `isGenderless`.
  - `PokemonSpeciesData`: Consolidação dos dados específicos da espécie.
  - `RawPokeApiSpecies`, `RawEvolutionNode`, `RawEvolutionChainResponse`: Contratos brutos da PokéAPI com tipagem estrita (zero `any`).

---

## 3. Funções Puras de Normalização e Helpers

Todas as transformações de dados da PokéAPI foram isoladas em funções puras para facilitar testes unitários e manutenibilidade:

1. **`extractIdFromUrl(url: string): number`**: Extrai com segurança o ID numérico a partir de URLs da PokéAPI (com ou sem barras finais).
2. **`getPokemonSpriteUrl(id: number): string`**: Monta o link para o sprite oficial em alta definição (`home` sprite), com fallback para `/images/pokeball.svg`.
3. **`formatFlavorText(text: string): string`**: Sanitiza caracteres de controle legados da PokéAPI (`\f`, `\n`, `\r`, `\t`) substituindo por espaços normais.
4. **`calculateGenderRate(genderRate: number): PokemonGenderRate`**: Converte a escala em octetos da API (-1 a 8) em porcentagens exatas de gênero (ex.: 1 octeto = 12.5% fêmea / 87.5% macho; -1 = assexuado).
5. **`mapRawSpeciesToSpeciesData(raw: RawPokeApiSpecies): PokemonSpeciesData`**: Normaliza a espécie selecionando textos e categorias prioritariamente em inglês (`en`).
6. **`mapRawEvolutionChainToEvolutionNode(raw: RawEvolutionChainResponse): EvolutionNode`**: Mapeia recursivamente a árvore evolutiva a partir do nó raiz.
7. **`flattenEvolutionChain(root: EvolutionNode): EvolutionNode[]`**: Helper que planifica a árvore em uma lista linear sequencial, facilitando a renderização em componentes de lista.
8. **`mapRawPokeApiToPokemonDetails(pokemon, rawSpecies, evolutionChain?)`**: Agrega o `Pokemon` base com os dados da espécie e evolução.

---

## 4. Integração HTTP (`src/models/pokeApi.service.ts`)

Três novos métodos assíncronos foram disponibilizados no `pokeApiService`:

- **`getPokemonSpecies(id: string | number): Promise<RawPokeApiSpecies>`**:
  Executa `GET /pokemon-species/{id}`.
- **`getEvolutionChain(url: string): Promise<EvolutionNode>`**:
  Faz o fetch da URL fornecida pela espécie e mapeia para `EvolutionNode`.
- **`getPokemonDetails(id: string | number): Promise<PokemonDetails>`**:
  Executa chamadas paralelas otimizadas (`Promise.all`) para buscar dados do Pokémon e da espécie simultaneamente, e em seguida busca a evolução de forma resiliente (não quebrando o retorno caso a evolução falhe).

---

## 5. Cobertura de Testes Unitários (`src/models/pokemon.model.test.ts`)

Foram implementados 17 testes automatizados cobrindo:

- Extração de ID com URLs válidas, inválidas e sem trailing slash.
- Fallback de sprites para IDs inexistentes ou negativos.
- Limpeza de form feeds e quebras de linha em textos de descrição.
- Casos de borda de cálculo de gênero (assexuado, 12.5%, 50%, 100%).
- Mapeamento completo e resiliência a campos ausentes na espécie.
- Mapeamento hierárquico e planificação de cadeias evolutivas (ex.: Pichu ➔ Pikachu ➔ Raichu).
- Composição final do objeto `PokemonDetails`.

---

## 6. Camada de ViewModel da Tela de Detalhes (`src/views/Details/viewModel/`)

Na Task 2, foi implementado o custom hook `useDetailsViewModel` para orquestrar o estado e o ciclo de vida da tela/modal de detalhes.

### 6.1 Contrato da ViewModel (`DetailsViewModel`)

```ts
export interface DetailsViewModel {
  pokemon: PokemonDetails | null;
  isLoading: boolean;
  error: string | null;
  handleRetry: () => void;
}
```

### 6.2 Comportamentos e Estados

- **Entrada (`idOrName?: string | number | null`)**: Aceita ID numérico ou nome do Pokémon. Se o identificador for nulo ou vazio, a ViewModel permanece em estado neutro (`pokemon: null`, `isLoading: false`, `error: null`).
- **Estado de Carregamento (`isLoading`)**: Sinaliza o início e término da busca assíncrona.
- **Tratamento Seguro de Erros (`error`)**: Captura exceções da API através de narrowing (`err instanceof Error ? err.message : '...'`), mantendo zero `any`.
- **Ação de Recuperação (`handleRetry`)**: Permite que a View reexecute a chamada em caso de falha de rede sem recarregar a aplicação.
- **Testes Unitários (`useDetailsViewModel.test.ts`)**: Cobertura completa de loading inicial, sucesso, erro de API e recuperação via retry.

---

## 7. Componentes Visuais Exclusivos da Tela de Detalhes (`src/views/Details/components/`)

Na Task 3, foram criados os componentes visuais dedicados que compõem a interface detalhada do Pokémon:

### 7.1 `StatBar` (`src/views/Details/components/StatBar/`)

Componente responsável por apresentar as estatísticas base (HP, ATK, DEF, SATK, SDEF, SPD) em formato de barra de progresso com rótulo, valor numérico e coloração contextual:

- **Contrato de Props (`StatBarProps`)**:
  ```ts
  export interface StatBarProps {
    label: string;
    value: number;
    max?: number; // Padrão: 255
    statName?: 'hp' | 'atk' | 'def' | 'satk' | 'sdef' | 'spd' | string;
    customColor?: string;
    className?: string;
  }
  ```
- **Estilização com Transient Props**: Utiliza `$progress` e `$statColor` para evitar vazamento de propriedades ao DOM. Consome dinamicamente a paleta do tema (`theme.colors.stats`).
- **Acessibilidade**: Atributos `role="progressbar"`, `aria-valuenow`, `aria-valuemin` e `aria-valuemax`.

### 7.2 `EvolutionChain` (`src/views/Details/components/EvolutionChain/`)

Componente que renderiza a sequência evolutiva do Pokémon com avatares circulares, nomes, números formatados e indicadores de transição (nível, pedra ou condição especial):

- **Contrato de Props (`EvolutionChainProps`)**:
  ```ts
  export interface EvolutionChainProps {
    evolutions?: EvolutionNode[];
    chain?: EvolutionNode[] | EvolutionNode | null;
    currentPokemonId?: number;
    onSelectPokemon?: (id: number) => void;
    className?: string;
  }
  ```
- **Flexibilidade**: Suporta tanto arrays lineares já planificados (`evolutions`) quanto árvores hierárquicas (`chain`), normalizando via `flattenEvolutionChain`.
- **Casos de Borda**: Exibe mensagem informativa amigável (_"Este Pokémon não possui evoluções."_) quando o Pokémon não evolui.
- **Interatividade**: Permite navegar diretamente para outro Pokémon da cadeia ao clicar no card (`onSelectPokemon`), destacando o estágio atual com `$isCurrent`.

---

## 8. View Principal de Detalhes (`src/views/Details/`)

Na Task 4, foi implementada a tela completa de detalhes conectando a ViewModel (`useDetailsViewModel`) aos componentes de apresentação (`StatBar`, `EvolutionChain` e componentes globais).

### 8.1 Contrato de Props (`DetailsViewProps`)

```ts
export interface DetailsViewProps {
  pokemonId?: string | number | null;
  onBack?: () => void;
  onSelectPokemon?: (id: number) => void;
}
```

### 8.2 Arquitetura de Apresentação (Sub-renderers)

Para manter o JSX limpo e declarativo, a `DetailsView` adota a convenção de sub-renderers privados:

- **`renderTopNav()`**: Barra superior com botão de retorno interativo (`onBack`).
- **`renderLoading()`**: Exibe o `Loader` centralizado com texto e animação giratória.
- **`renderError()`**: Apresenta mensagem amigável de falha e botão de recuperação chamando `handleRetry()`.
- **`renderContent()`**: Monta a visualização rica do Pokémon carregado:
  - Cabeçalho colorido com nome, número e badges de tipos (`Badge`).
  - Hero image destacada com transição e sombra.
  - Cartão inferior branco contendo descrição, grid de métricas (altura, peso, categoria, proporção de gênero), lista de habilidades, barras de estatísticas base (`StatBar`) e a cadeia de evolução (`EvolutionChain`).

### 8.3 Estilização e Tematização Dinâmica

- **Fundo Contextual (`$mainType`)**: O container principal (`DetailsContainer`) ajusta sua cor de fundo dinamicamente baseando-se no tipo primário do Pokémon (`theme.colors.types[$mainType]`), criando uma identidade visual imersiva e consistente.
- **Transient Props (`$` prefix)**: Todas as propriedades de controle visual (`$mainType`) não vazam para o DOM.

### 8.4 Testes Automatizados (`Details.test.tsx`)

Foram implementados testes unitários com Vitest e React Testing Library cobrindo:

- Exibição inicial do estado de loading.
- Tratamento e recuperação de erro de fetch com botão de retry.
- Renderização completa de todos os dados do Pokémon (métricas, stats, habilidades, evoluções).
- Disparo do callback `onBack` no clique do botão de voltar.

---

## 9. Pontos de Atenção para as Próximas Tasks

1. **Integração na Tela Inicial (HomeView / Modal / Roteamento)**:
   A `DetailsView` pode ser exibida em um modal sobreposto ou via roteamento, bastando fornecer `pokemonId` e os callbacks `onBack` e `onSelectPokemon`.
2. **Navegação Contínua**:
   Ao interagir com um Pokémon da cadeia evolutiva, a `DetailsView` dispara `onSelectPokemon(id)`, permitindo atualizar o `pokemonId` sem precisar fechar e reabrir a visualização.
