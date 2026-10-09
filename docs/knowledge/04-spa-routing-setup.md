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

| Rota           | Componente / Wrapper           | Comportamento & Parâmetros                                                                                                                                                                      |
| -------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`            | `HomeRoute` (`HomeView`)       | Listagem com filtros, busca e paginação. Selecionar um card navega para `/pokemon/:id`.                                                                                                         |
| `/pokemon/:id` | `DetailsRoute` (`DetailsView`) | Tela completa de detalhes. Captura o parâmetro `id` dinamicamente via `useParams<{ id: string }>()`. Botão voltar retorna para `/` e cliques em nós da evolução navegam para `/pokemon/:newId`. |
| `*`            | `<Navigate to="/" replace />`  | Fallback universal que redireciona URLs inexistentes para a raiz `/`.                                                                                                                           |

### 3.1 Estrutura Implementada no `App.tsx`

```tsx
export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/pokemon/:id" element={<DetailsRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
};
```

---

## 4. Convenções e Setup de Testes com `MemoryRouter` (`src/test/test-utils.tsx`)

Para garantir que todos os componentes e views que utilizam hooks de rota (`useNavigate`, `useParams`, `useLocation`) possam ser testados de forma limpa e isolada:

1. **`AllTheProviders`**:
   O provedor global de testes agora envolve a árvore tanto com `MemoryRouter` quanto com `ThemeProvider`:

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
   A função `render` de `test-utils` agora suporta a opção `initialEntries`, permitindo testar deep linking em testes unitários e de integração:

   ```tsx
   render(<App />, { initialEntries: ['/pokemon/1'] });
   ```

---

## 5. Cobertura de Testes Automatizados

O arquivo `src/App.test.tsx` cobre os fluxos principais de integração:

- **Fluxo Inicial e Interativo**: Renderização de `HomeView` na raiz `/`, transição para `/pokemon/1` ao clicar no card e retorno para `/` via botão "Voltar".
- **Deep Linking Direto**: Acesso imediato à rota `/pokemon/1` renderizando dados de espécie e evolução do Pokémon correto.
- **Rota Coringa (Fallback)**: Redirecionamento automático de rotas não mapeadas para `/`.
