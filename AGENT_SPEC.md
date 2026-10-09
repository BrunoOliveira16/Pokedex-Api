# AGENT_SPEC.md — Diretrizes e Especificação do Repositório

Este documento define a arquitetura, convenções e regras estritas para o desenvolvimento, manutenção e geração de código neste projeto. Qualquer modificação ou nova feature gerada por agentes automatizados deve seguir rigorosamente estas diretrizes.

---

## 1. Visão Geral da Arquitetura

O projeto adota o padrão **MVVM (Model-View-ViewModel)** construído sobre **React 18**, **TypeScript** e **Styled Components v6**.

### 1.1 Árvore de Diretórios Resumida

```text
Pokedex-Api/
├── public/
│   └── images/              # Assets estáticos (SVGs de tipos, logos, wallpapers)
├── src/
│   ├── components/          # Componentes globais compartilhados e reutilizáveis
│   │   └── <Componente>/    # index.tsx, styled.ts, <Componente>.test.tsx
│   ├── models/              # Camada de Dados (Model): contratos, mappers e serviços
│   │   ├── pokemon.model.ts # Interfaces da entidade, tipos e mapper puro
│   │   └── pokeApi.service.ts # Cliente HTTP de integração com a PokéAPI
│   ├── views/               # Camada de Apresentação (View e ViewModel)
│   │   └── Home/
│   │       ├── components/  # Componentes exclusivos da tela
│   │       │   └── <Componente>/ # index.tsx, styled.ts
│   │       ├── viewModel/   # Camada ViewModel da tela
│   │       │   ├── index.ts
│   │       │   └── useHomeViewModel.ts # Hook com estados, efeitos e ações
│   │       ├── index.tsx    # View pura (JSX declarativo e sub-renderers)
│   │       └── styled.ts    # Layout estilizado da tela
│   ├── styles/              # Design System e Temas
│   │   ├── global.ts        # createGlobalStyle (reset, fontes, container)
│   │   ├── styled.d.ts      # Extensão de tipagem do DefaultTheme
│   │   └── theme.ts         # Tokens de cor, tipos Pokémon, borderRadius e sombras
│   ├── test/                # Setup de Testes Automatizados
│   │   ├── setup.ts         # Setup do Vitest (@testing-library/jest-dom)
│   │   └── test-utils.tsx   # Wrapper com ThemeProvider para renderização de testes
│   ├── App.tsx              # Componente raiz com ThemeProvider e GlobalStyle
│   └── main.tsx             # Entry point React 18 (createRoot)
```

### 1.2 Convenção de Pastas

- **`src/components/`**: Componentes atômicos e agnósticos a telas específicas (ex.: `Badge`, `Button`, `Header`, `Loader`, `ProgressBar`). Cada componente possui seu próprio diretório com `index.tsx`, `styled.ts` e `<Componente>.test.tsx`.
- **`src/views/<View>/`**: Telas da aplicação. Mantém apenas orquestração de layout e sub-renderers visuais.
- **`src/views/<View>/viewModel/`**: Hooks dedicados contendo toda a lógica de negócio, chamadas assíncronas, controle de paginação, busca e estados da respectiva View.
- **`src/views/<View>/components/`**: Subcomponentes consumidos exclusivamente por aquela tela (ex.: `GenerationTabs`, `PokemonCard`, `SearchBar`).
- **`src/models/`**: Contratos de dados de API (`RawPokeApiDetail`), entidades de domínio (`Pokemon`), constantes (`GENERATIONS`), funções de transformação pura (`mapRawPokeApiToPokemon`) e serviços de fetch (`pokeApiService`).
- **`src/styles/`**: Centralização de tokens visuais e tipagem do Styled Components.
- **`public/images/`**: Todo asset estático (imagens, ícones SVG de tipos) reside em `public/images/`. Não existe diretório `src/assets`. Referencie com caminhos absolutos como `/images/${type}.svg` ou `/images/pokeball.svg`.

---

## 2. Padrões de Código e Sintaxe

### 2.1 Declaração de Componentes

- **Não utilizar `React.FC`**. Tipar os parâmetros de props diretamente na assinatura da função.
- Declaração via constante e arrow function:
  ```tsx
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'generation';
    isActive?: boolean;
    children: React.ReactNode;
  }

  export const Button = ({
    variant = 'primary',
    isActive = false,
    children,
    ...rest
  }: ButtonProps) => {
    return (
      <StyledButton $variant={variant} $isActive={isActive} {...rest}>
        {children}
      </StyledButton>
    );
  };
  ```
- Em Views de maior complexidade (como `HomeView`), organizar o retorno usando sub-renderers privados (`renderLoading`, `renderError`, etc.) para manter o JSX limpo e legível.

### 2.2 Export e Import

- **Named Exports Exclusivos**: Sempre utilizar `export const NomeComponente` e `export interface NomeProps`. **Nunca** utilize `export default` em código de produção em `src/`.
- **Ausência de Path Aliases**: Não utilize `@/...` ou aliases customizados; utilize caminhos relativos estritos (`./`, `../`, `../../`).
- **Ordenação Automática de Imports (`eslint-plugin-simple-import-sort`)**:
  1. Dependências externas (React, bibliotecas terceiras).
  2. Módulos internos / relativos (components, models, views).
  3. Estilos locais (`./styled`).

---

## 3. Padrões de Estilização (Styled Components v6)

### 3.1 ThemeProvider e Tipagem

- O `ThemeProvider` é injetado globalmente no topo da árvore em `src/App.tsx` e replicado nos testes em `src/test/test-utils.tsx`.
- Tipagem estrita garantida via `src/styles/styled.d.ts`, estendendo a interface `DefaultTheme` do Styled Components a partir do tipo do objeto `theme`.

### 3.2 Transient Props (Prefixo `$`)

- **Regra Obrigatória**: Qualquer prop customizada repassada para um styled component que não pertença aos atributos HTML padrão **deve** usar o prefixo `$` para evitar repasse indevido ao DOM:
  ```tsx
  // No arquivo styled.ts
  interface CardProps {
    $mainType: string;
  }

  export const CardContainer = styled.li<CardProps>`
    background-color: ${({ theme, $mainType }) =>
      theme.colors.types[$mainType] || '#777777'};
  `;
  ```

### 3.3 Tokens de Design (`src/styles/theme.ts`)

- **Cores**:
  - Principais: `theme.colors.primary` (`#0f4ad1`), `theme.colors.secondary` (`#f7cf2e`).
  - Superfícies: `theme.colors.background` (`#F6F8FC`), `theme.colors.cardBackground` (`#FFFFFF`).
  - Textos: `theme.colors.text` (`#2c3e50`), `theme.colors.textLight` (`#FFFFFF`), `theme.colors.textMuted` (`#6c757d`).
  - Tipos Pokémon: `theme.colors.types[tipo]` (ex.: `fire`, `water`, `grass`, `electric`, etc.).
  - Atributos base: `theme.colors.stats` (`hp`, `atk`, `def`, `satk`, `sdef`, `spd`).
- **Border Radius**: `theme.borderRadius.sm` (`0.25rem`), `md` (`0.5rem`), `lg` (`1rem`), `full` (`9999px`).
- **Sombras**: `theme.shadows.sm`, `md`, `lg`, `button`.
- **Blocos Condicionais e Animações**: Utilizar o helper `css` para variações e `keyframes` para animações declarativas.

---

## 4. Tipagem (TypeScript)

- **Strict Mode Ativo**: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`.
- **Interfaces de Componentes**: Nomeadas no formato `<Componente>Props` e exportadas no mesmo arquivo `index.tsx`.
- **Interfaces de Estilização**: Nomeadas no formato `Styled<Componente>Props` ou `<Nome>Props` no próprio `styled.ts`, com transient props prefixadas por `$`.
- **Interfaces de ViewModel**: O hook deve expor um contrato claro tipado como `<View>ViewModel` (ex.: `HomeViewModel`).
- **Tratamento Seguro de Erros**: Sempre tipar erros capturados em blocos de exceção como `unknown` e realizar narrowing seguro:
  ```ts
  try {
    // ...
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Mensagem de erro padrão';
    setError(message);
  }
  ```
- **Zero `any`**: O uso de `any` deve ser evitado. Quando inevitável, requer justificativa explícita.

---

## 5. Regras Operacionais para o Agente

### O que você DEVE fazer:

1. **Seguir a Tríade de Componentes**: Criar novos componentes mantendo `index.tsx` (UI), `styled.ts` (estilização) e `<Componente>.test.tsx` (testes).
2. **Utilizar Named Exports**: Exportar todas as funções, componentes e tipos usando `export const` e `export interface`.
3. **Respeitar o MVVM**: Isolar chamadas de API em `src/models/` e toda lógica de estado/manipulação de dados em custom hooks sob `views/<View>/viewModel/`.
4. **Usar Transient Props (`$`)**: Garantir que toda prop customizada em Styled Components utilize o prefixo `$`.
5. **Utilizar Design Tokens**: Consumir fontes, cores, espaçamentos e bordas diretamente de `${({ theme }) => theme...}`.
6. **Escrever Testes com Vitest**: Cobrir componentes com testes unitários importando `render` e `screen` de `src/test/test-utils`.
7. **Validar com Linters e Testes**: Sempre rodar `npm run lint` e `npm run test` após qualquer alteração para validar que a suíte e a ordenação de imports (`simple-import-sort`) estão em conformidade.
8. **Tipar Parâmetros de Props Diretamente**: Tipar props diretamente na assinatura do componente em vez de utilizar `React.FC`.
9. **Seguir o Padrão de Commits e MRs**: Utilizar commits estritamente no formato `<tipo>: <descrição>` (sem escopo entre parênteses) em inglês e descrições de MR seguindo o template da seção 6.

### O que você NÃO DEVE fazer:

1. **NÃO usar `export default`** em arquivos da pasta `src/`.
2. **NÃO inventar Path Aliases** (`@/...`, `~/...`), pois o bundler e o compilador não possuem paths configurados.
3. **NÃO usar estilos inline (`style={{}}`)** nem arquivos `.css` ou frameworks utilitários (Tailwind, Bootstrap); toda estilização pertence a `styled-components`.
4. **NÃO passar props de estilo sem `$`** para componentes estilizados.
5. **NÃO misturar lógica de dados dentro do JSX**: Não faça `fetch` direto dentro de componentes visuais.
6. **NÃO criar diretório `src/assets`**: Todos os assets estáticos devem ser alocados em `public/images/`.
7. **NÃO ignorar ou alterar a ordem de imports**: O linter bloqueia commits que não sigam a regra de ordenação alfabética e por escopo.
8. **NÃO usar `any`** para contornar problemas de tipagem.
9. **NÃO usar `React.FC`**: Declarar componentes tipando os parâmetros diretamente (`({ prop }: ComponentProps) => ...`).
10. **NÃO adicionar escopo entre parênteses nos commits**: Nunca utilize `feat(modulo):` ou `refactor(core):`; use sempre apenas `feat:` ou `refactor:`.

---

## 6. Padrões de Git, Commits e Merge Requests

Para manter o histórico do repositório limpo, rastreável e consistente, todas as alterações, commits e propostas de integração devem seguir rigorosamente os padrões abaixo.

### 6.1 Padrão de Branches

- Nomenclatura em **kebab-case** com prefixo indicativo do tipo de tarefa:
  - `feature/<nome-da-feature>`: Novas telas, fluxos ou componentes (ex.: `feature/pokemon-details`).
  - `refactor/<nome-do-refactor>`: Reestruturação de código ou migrações (ex.: `refactor/remove-legacy-assets`).
  - `fix/<descricao-do-bug>`: Correção de bugs (ex.: `fix/pokemon-card-type-color`).
  - `docs/<descricao>`: Documentação e guias (ex.: `docs/update-agent-spec`).
  - `test/<descricao>`: Criação ou ajuste de suítes de testes (ex.: `test/add-view-model-tests`).

### 6.2 Convenção de Mensagens de Commit

- **Formato Estrito**: `<tipo>: <descrição>`
- **REGRA OBRIGATÓRIA**: **NÃO utilizar escopo entre parênteses**. É expressamente proibido o uso de `feat(styles):`, `refactor(core):` ou similares. O prefixo deve ser direto, sem parênteses: `feat:`, `refactor:`, `fix:`, `docs:`, `test:`, `chore:`, `build:`.
- **Idioma e Sintaxe**: Mensagens em **inglês**, iniciando em letra minúscula logo após o espaço, no modo imperativo e direto (sem ponto final).
- **Tipos Permitidos**:
  - `feat`: Adição de nova funcionalidade ou componente.
  - `refactor`: Refatoração ou reestruturação de código sem alteração de funcionalidade.
  - `fix`: Correção de bug.
  - `docs`: Modificações em arquivos de documentação (`README.md`, `AGENT_SPEC.md`).
  - `test`: Adição ou modificação de testes unitários ou de integração.
  - `chore`: Atualizações de ferramentas, configurações de DX, dependências ou scripts.
  - `build`: Modificações no bundler (Vite), TypeScript ou scripts de build.
- **Exemplos Corretos**:
  - `feat: implement pokemon search filter by id and name`
  - `refactor: remove React.FC and adopt direct props typing across components`
  - `docs: add AGENT_SPEC with architecture overview and coding guidelines`
  - `fix: resolve broken sprite fallback when image fails to load`
  - `test: add unit tests for home view model pagination`
- **Exemplos Incorretos (Proibidos)**:
  - ❌ `feat(styles): implement design system` _(possui escopo entre parênteses)_
  - ❌ `refactor(core): remove React.FC` _(possui escopo entre parênteses)_
  - ❌ `Corrigindo bug no card` _(em português / gerúndio)_

### 6.3 Padrão de Merge Request (MR / PR)

#### Título do MR

- Seguir o mesmo padrão de commit sem parênteses: `<tipo>: <descrição clara da entrega>`
- Exemplo: `refactor: migrate legacy Vanilla JS architecture to React 18, TypeScript and MVVM`

#### Template Obrigatório da Descrição do MR

```markdown
## 📌 Contexto & Motivação

[Descreva o problema anterior, limitações da arquitetura legada ou necessidade técnica/negócio que motivou esta entrega]

---

## 🚀 O Que Foi Feito?

[Liste de forma categorizada e clara as mudanças técnicas, arquiteturais e novos componentes adicionados]

### 1. [Categoria/Módulo 1]

- ...

### 2. [Categoria/Módulo 2]

- ...

---

## 🧪 Como Testar & Validação

[Comandos executados e passos manuais para verificar a entrega]

### Testes Automatizados:

- npm run test (resultado)
- npm run lint (resultado)
- npm run build (resultado)

### Validação Manual:

1. ...
2. ...

---

## ✅ Checklist de Revisão

- [ ] Compilação TypeScript sem erros (tsc --noEmit)
- [ ] Cobertura de testes unitários com Vitest
- [ ] Validação de Lint e ordenação de imports (npm run lint)
- [ ] Conformidade total com AGENT_SPEC.md (zero React.FC, transient props $, etc.)
```

### 6.4 Validação Prévia Obrigatória

Antes de commitar ou abrir qualquer MR:

1. Executar `npm run lint` para garantir a ordenação de imports (`simple-import-sort`) e ausência de regras violadas.
2. Executar `npm run test` (todos os testes devem passar; os hooks de `pre-commit` e `pre-push` do Husky rejeitarão qualquer falha).
3. Executar `npx tsc --noEmit` para garantir zero erros de tipagem estrita.
