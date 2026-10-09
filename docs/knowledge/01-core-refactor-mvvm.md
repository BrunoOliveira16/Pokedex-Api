# 01 - Refatoração do Core: Migração de Vanilla JS para React 18, TypeScript e MVVM

## 1. Contexto & Motivação

O projeto original consistia em uma Pokédex legada desenvolvida em Vanilla JavaScript, HTML5 e CSS nativo, contida no diretório `assets/`. As principais dores identificadas eram:

- **Manipulação imperativa do DOM**: Inserção manual de elementos via `innerHTML` e concatenação de strings.
- **Falta de tipagem**: Dados da PokéAPI consumidos sem validação estrita ou contratos em tempo de compilação.
- **Acoplamento**: Lógica de requisição, transformação e interface misturadas nos mesmos scripts (`main.js`, `poke-api.js`).
- **Ausência de testes e padronização**: Sem suíte automatizada de testes nem ferramentas de análise estática.

---

## 2. Decisões Arquiteturais e Estrutura Adotada

A aplicação foi integralmente refatorada para o ecossistema moderno em **React 18**, **TypeScript 5.7** e **Styled Components v6**, adotando o padrão **MVVM (Model-View-ViewModel)**.

### 2.1 Camadas da Arquitetura

1. **Model (`src/models/`)**:
   - `pokemon.model.ts`: Define a entidade `Pokemon`, configurações de geração (`GENERATIONS`, `GenerationConfig`), contratos brutos da API (`RawPokeApiDetail`) e a função pura de transformação `mapRawPokeApiToPokemon`.
   - `pokeApi.service.ts`: Serviço assíncrono isolado para consumo da PokéAPI v2 via `fetch`.
2. **ViewModel (`src/views/Home/viewModel/`)**:
   - Hook customizado `useHomeViewModel`: Isola todo o gerenciamento de estado (`useState`), paginação em lotes (_batch size_ de 15), busca instantânea combinada (por nome, id ou tipo) e controle de ciclo de vida (`useEffect`).
   - Mantém as telas completamente desacopladas de regras de negócio.
3. **View (`src/views/Home/`)**:
   - `HomeView`: Componente puramente declarativo que consome o ViewModel e renderiza layouts através de sub-renderers privados (`renderLoading`, `renderError`, `renderEmpty`, `renderPokemonGrid`).
   - Subcomponentes de tela específicos: `GenerationTabs`, `PokemonCard`, `SearchBar`.
4. **Componentes Globais Reutilizáveis (`src/components/`)**:
   - Componentes atômicos organizados na tríade estrita:
     - `Badge`: Tag visual do tipo com ícone SVG dinâmico (`/images/[type].svg`).
     - `Button`: Botão polimórfico com suporte a variantes (`primary`, `secondary`, `outline`, `generation`).
     - `Header`: Cabeçalho centralizado com logo oficial e badge do app.
     - `Loader`: Indicador visual com Pokébola giratória e texto customizável.
     - `ProgressBar`: Barra de estatísticas animada e colorida conforme o tipo do Pokémon.

---

## 3. Padrões de Estilização e Design System

- **Design Tokens (`src/styles/theme.ts`)**: Centraliza paleta de cores para todos os tipos de Pokémon, valores de border radius, sombras e cores semânticas.
- **Tipagem do Tema (`src/styles/styled.d.ts`)**: Extende `DefaultTheme` do Styled Components garantindo autocompletion e checagem de tipos estrita.
- **Transient Props**: Uso obrigatório do prefixo `$` (ex.: `$variant`, `$isActive`, `$mainType`, `$colorType`) para impedir que props de controle de estilo vazem para atributos do DOM HTML.
- **Assets Estáticos**: Todos os ícones SVG e imagens residem em `public/images/` e são consumidos por caminhos absolutos (ex.: `/images/pokeball.svg`).

---

## 4. Convenções de Código e Tipagem

- **Zero `React.FC`**: Props tipadas diretamente na assinatura da função:
  ```tsx
  export const Component = ({ prop }: ComponentProps) => { ... };
  ```
- **100% Named Exports**: Nenhum `export default` permitido na pasta `src/`.
- **Imports Relativos**: Sem path aliases (`@/...`).
- **Ordenação Automática**: ESLint com `simple-import-sort` organizando módulos externos, internos e de estilos.

---

## 5. Qualidade e Automação (DX)

- **Vitest + Testing Library**: Suíte de testes unitários com wrapper de `ThemeProvider` customizado em `src/test/test-utils.tsx`.
- **Husky**: Hooks de `pre-commit` e `pre-push` executando testes automaticamente para impedir que código quebrado entre no repositório.

---

## 6. Pontos de Atenção para Próximas Sessões

- Nunca acoplar chamadas de API diretamente no JSX; passe sempre pelo ViewModel.
- Manter a cobertura de testes unitários para novos componentes criados.
- Ao adicionar novas props em styled components, sempre utilizar o prefixo `$`.
