# ⚡ Pokédex React & TypeScript (MVVM)

<div align="center">
  <img src="./public/images/pokeapi_256.png" alt="PokéAPI Logo" width="260"/>
  <p><strong>Aplicação moderna de Pokédex consumindo a PokéAPI, refatorada em React 18, TypeScript e arquitetura MVVM.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/styled--components-6.1-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" alt="styled-components" />
    <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Vitest-Testing-FCC624?style=for-the-badge&logo=vitest&logoColor=black" alt="Vitest" />
    <img src="https://img.shields.io/badge/ESLint-9.x-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
    <img src="https://img.shields.io/badge/Prettier-3.x-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier" />
  </p>
</div>

---

## 📌 Visão Geral

Este projeto é uma refatoração completa de uma Pokédex legada em Vanilla JavaScript para uma aplicação moderna e profissional em **React com TypeScript**.

A arquitetura foi desenhada seguindo o padrão **MVVM (Model-View-ViewModel)** com componentes estilizados via **styled-components**, separação estrita entre componentes globais reutilizáveis e componentes específicos de tela, suíte completa de **testes unitários com Vitest**, pipeline de formatação/linting com **ESLint + Prettier** e controle de qualidade via **Git Pre-Push Hook (Husky)**.

---

## ✨ Funcionalidades

- **Navegação por Gerações:** Navegue da 1ª até a 9ª Geração de Pokémon + região de Arceus (Hisui) com offsets e limites pré-configurados.
- **Busca em Tempo Real:** Filtre instantaneamente por nome ou número do Pokémon.
- **Carregamento Otimizado (Pagination Batching):** Carregamento em lotes de 15 em 15 Pokémon, garantindo alta performance e feedback visual de carregamento.
- **Cards Ricos em Detalhes:**
  - Imagens de alta definição (sprites oficiais da PokéAPI).
  - Badges coloridas com ícones SVG dinâmicos por tipo elemental.
  - Peso e altura normalizados (kg e metros).
  - Listagem de habilidades.
  - Barras de progresso visual para todos os atributos base (HP, ATK, DEF, SATK, SDEF, SPD).
- **Design Totalmente Responsivo:** Grid fluido adaptado de smartphones a monitores ultrawide.
- **Qualidade de Código Automatizada:** Formatação ao salvar (`Ctrl + S`), ordenação automática de imports e bloqueio de commits/pushes quebrados.

---

## 🏗️ Arquitetura do Projeto (MVVM)

A estrutura do projeto implementa rigorosamente a separação de responsabilidades:

```text
src/
├── components/                  # Componentes Globais Reutilizáveis
│   ├── Badge/                   # (index.tsx, styled.ts, Badge.test.tsx)
│   ├── Button/                  # (index.tsx, styled.ts, Button.test.tsx)
│   ├── Header/                  # (index.tsx, styled.ts, Header.test.tsx)
│   ├── Loader/                  # (index.tsx, styled.ts, Loader.test.tsx)
│   └── ProgressBar/             # (index.tsx, styled.ts, ProgressBar.test.tsx)
│
├── models/                      # MODEL: Tipagem e Serviços de Dados
│   ├── pokemon.model.ts         # Interfaces, tipos e normalizadores
│   └── pokeApi.service.ts       # Chamadas HTTP à PokéAPI
│
├── views/                       # VIEW: Telas da Aplicação
│   └── Home/
│       ├── components/          # Componentes Específicos da Tela
│       │   ├── GenerationTabs/  # (index.tsx, styled.ts)
│       │   ├── PokemonCard/     # (index.tsx, styled.ts)
│       │   └── SearchBar/       # (index.tsx, styled.ts, SearchBar.test.tsx)
│       ├── viewModel/           # VIEW-MODEL: Estados, Efeitos e Ações
│       │   ├── index.ts
│       │   └── useHomeViewModel.ts
│       ├── index.tsx            # View pura (apenas JSX declarativo e render functions)
│       └── styled.ts            # Estilização do layout da tela
│
├── styles/                      # Design System e Temas
│   ├── global.ts                # Estilos globais e fontes
│   ├── styled.d.ts              # Extensão de tipagem do DefaultTheme
│   └── theme.ts                 # Cores por tipo de Pokémon, espaçamentos e sombras
│
└── test/                        # Configuração da Suíte de Testes
    ├── setup.ts                 # Setup do Jest-DOM
    └── test-utils.tsx           # Wrapper com ThemeProvider para renderização de testes
```

### Padrão dos Componentes

Todos os componentes seguem a convenção estrita de pasta com:

- `index.tsx`: Implementação do componente em React/TypeScript.
- `styled.ts`: Elementos estilizados com styled-components.
- `[Componente].test.tsx`: Testes unitários do componente.

---

## 🚀 Como Instalar e Rodar

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) versão `20.x` ou superior
- [npm](https://www.npmjs.com/) versão `10.x` ou superior (ou `pnpm` / `yarn`)
- [Git](https://git-scm.com/)

### Passo a Passo

1. **Clonar o repositório:**

   ```bash
   git clone https://github.com/BrunoOliveira16/Pokedex-Api.git
   cd Pokedex-Api
   ```

2. **Instalar as dependências:**

   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Abra no seu navegador o endereço indicado no terminal (normalmente `http://localhost:5173`).

---

## 🛠️ Comandos Disponíveis

| Comando                | Descrição                                                                         |
| :--------------------- | :-------------------------------------------------------------------------------- |
| `npm run dev`          | Inicia o servidor Vite em modo de desenvolvimento com Hot Module Replacement.     |
| `npm run build`        | Compila o TypeScript e gera o build de produção otimizado na pasta `dist/`.       |
| `npm run preview`      | Executa um servidor local para visualizar o build de produção gerado.             |
| `npm run test`         | Executa todos os testes unitários do projeto via **Vitest**.                      |
| `npm run test:global`  | Executa especificamente os testes dos **componentes globais** (`src/components`). |
| `npm run test:watch`   | Executa o Vitest em modo interativo (assistindo alterações de arquivos).          |
| `npm run lint`         | Analisa a base de código com o **ESLint 9** (Flat Config).                        |
| `npm run lint:fix`     | Corrige automaticamente problemas de lint e ordena imports.                       |
| `npm run format`       | Formata todos os arquivos do projeto com o **Prettier**.                          |
| `npm run format:check` | Valida se todos os arquivos estão de acordo com as regras de formatação.          |

---

## 🛡️ Qualidade e Git Pre-Push Hook

O projeto conta com o **Husky** configurado para proteger o repositório remoto:

Toda vez que o comando `git push` for executado, o hook [pre-push](file:///.husky/pre-push) dispara automaticamente os testes dos componentes globais:

```bash
npm run test:global
```

> [!IMPORTANT]
> Se qualquer teste unitário falhar, o envio ao repositório remoto é **automaticamente cancelado**, garantindo que apenas código estável chegue ao GitHub.

---

## 💻 Integração com VS Code

O projeto inclui configurações prontas na pasta `.vscode/`:

- **Formatação ao salvar (`Ctrl + S`):** O Prettier ajusta espaçamento, aspas e indentação automaticamente.
- **Organização de Imports:** O ESLint com `eslint-plugin-simple-import-sort` reordena todos os imports de forma padronizada.
- **Extensões recomendadas:** Notificação automática no VS Code para instalar Prettier e ESLint ao abrir o projeto.

---

## 👨‍💻 Autor

Desenvolvido por **Bruno Oliveira**

- GitHub: [@BrunoOliveira16](https://github.com/BrunoOliveira16)

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
