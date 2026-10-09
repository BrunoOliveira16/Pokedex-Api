# 04 - Configuração do Roteamento SPA e Deep Linking (`react-router-dom`)

## 1. Objetivo & Motivação

Com a consolidação da tela de detalhes (`DetailsView`) e da listagem principal (`HomeView`), tornou-se essencial transformar a navegação em uma Single Page Application (SPA) declarativa com suporte a:

- **URLs Amigáveis e Compartilháveis**: Capacidade de acessar diretamente qualquer Pokémon via URL canônica (`/pokemon/:id`).
- **Histórico do Navegador**: Suporte nativo a botões de voltar/avançar e manipulação de abas sem perda de contexto.
- **Deep Linking**: Carregamento pontual da view de detalhes a partir de links externos ou bookmarks.

---

## 2. Instalação e Arquitetura de Entrada

- Dependência adicionada: `react-router-dom` (v7 / API declarativa de componentes de rota).
- **Entry Point (`src/main.tsx`)**: O componente raiz `<App />` é envolvido pelo `<BrowserRouter>`, isolando o contexto de histórico HTML5 na inicialização:

```tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## 3. Tabela de Rotas da Aplicação (`src/App.tsx`)

A hierarquia de rotas foi implementada declarativamente no `App.tsx` com `<Routes>` e `<Route>`, mantendo `ThemeProvider` e `GlobalStyle` no topo da árvore:

| Rota           | Componente                    | Comportamento & Parâmetros                                                                       |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `/`            | `HomeView`                    | Listagem com filtros, busca e paginação. Cada card navega de forma autônoma para `/pokemon/:id`. |
| `/pokemon/:id` | `DetailsView`                 | Tela completa de detalhes. Consome o parâmetro `id` dinamicamente da URL.                        |
| `*`            | `<Navigate to="/" replace />` | Fallback universal que redireciona URLs inexistentes para a raiz `/`.                            |

### 3.1 Estrutura Implementada no `App.tsx`

```tsx
export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/pokemon/:id" element={<DetailsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
};
```

---

## 4. Integração dos Hooks do React Router (`useParams` e `useNavigate`) no Padrão MVVM

Na Task 4, a orquestração de navegação foi descentralizada do container raiz e transferida diretamente para a ViewModel e os componentes consumidores, eliminando prop drilling:

### 4.1 Camada ViewModel (`useDetailsViewModel.ts`)

- **Resolução Automática de Parâmetros**: O hook extrai o parâmetro `id` diretamente da URL via `useParams<{ id: string }>()`, mantendo fallback resiliente caso o valor não esteja definido ou seja passado como override opcional.
- **Ação de Retorno Desacoplada**: A ViewModel exporta a ação `handleGoBack`, que executa `navigate(-1)` através do hook `useNavigate()`, permitindo que a View permaneça agnóstica à mecânica do histórico.

```ts
export interface DetailsViewModel {
  pokemon: PokemonDetails | null;
  isLoading: boolean;
  error: string | null;
  handleRetry: () => void;
  handleGoBack: () => void;
}
```

### 4.2 Camada de Visualização (`DetailsView`)

- O botão de retorno (`BackButton`) no topo da tela aciona diretamente `handleGoBack` fornecido pelo ViewModel.
- A navegação entre etapas da cadeia evolutiva (`EvolutionChain`) navega diretamente para `/pokemon/${id}` via `useNavigate()`, reiniciando a busca e scroll para o topo de forma fluida.
- Todas as props de topo (`pokemonId?`, `onBack?`, `onSelectPokemon?`) tornaram-se estritamente opcionais.

### 4.3 Componente `PokemonCard`

- Cada card na listagem principal possui navegação programática autônoma: ao ser clicado ou acionado via teclado (`Enter` / `Space`), navega diretamente para `/pokemon/${pokemon.id}` via `useNavigate()`.

---

## 5. Convenções e Setup de Testes com `MemoryRouter` (`src/test/test-utils.tsx`)

Para garantir que todos os componentes e views que utilizam hooks de rota (`useNavigate`, `useParams`, `useLocation`) possam ser testados de forma limpa e isolada:

1. **`AllTheProviders`**:
   O provedor global de testes envolve a árvore tanto com `MemoryRouter` quanto com `ThemeProvider`:

   ```tsx
   export const AllTheProviders = ({
     children,
     initialEntries = ['/'],
   }: {
     children: React.ReactNode;
     initialEntries?: MemoryRouterProps['initialEntries'];
   }) => (
     <MemoryRouter initialEntries={initialEntries}>
       <ThemeProvider theme={theme}>{children}</ThemeProvider>
     </MemoryRouter>
   );
   ```

2. **Custom Render (`renderWithProviders`)**:
   A função `render` de `test-utils` suporta a opção `initialEntries`, permitindo testar deep linking em testes unitários e de integração:

   ```tsx
   render(<App />, { initialEntries: ['/pokemon/1'] });
   ```

---

## 6. Cobertura de Testes Automatizados

- **`useDetailsViewModel.test.ts`**: Valida extração de parâmetro de rota via `MemoryRouter`, fallback para override explícito e disparo de `navigate(-1)` no `handleGoBack`.
- **`Details.test.tsx`**: Valida renderização sem props obrigatórias e acionamento do retorno via histórico.
- **`PokemonCard.test.tsx`**: Valida disparo de navegação para `/pokemon/:id` no clique e via teclado.
- **`App.test.tsx`**: Valida a orquestração ponta a ponta na raiz `/`, deep linking direto e rota de fallback coringa.
